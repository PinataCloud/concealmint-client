"use client";

import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ipfsClient } from "@/lib/pinata";

interface NFT {
	token_id: string;
	image_url: string;
	name: string;
	description: string;
}

export const NFTGrid = forwardRef((props, ref) => {
	const { ready, authenticated, getAccessToken } = usePrivy();
	const [nfts, setNfts] = useState<NFT[]>([]);
	const [loading, setLoading] = useState(false);

	useImperativeHandle(ref, () => ({
		getNFTs,
	}));

	const getNFTs = useCallback(async () => {
		try {
			setLoading(true);
			const accessToken = await getAccessToken();
			const nftReq = await fetch("/api/nfts", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			const nftData = await nftReq.json();
			const updatedNfts = await Promise.all(
				nftData.map(async (nft: any) => {
					const imageUrl = await ipfsClient.gateways.convert(
						nft.extra_metadata.image_original_url,
					);
					return {
						...nft,
						image_url: imageUrl,
					};
				}),
			);
			setNfts(updatedNfts);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}, [getAccessToken]);

	async function accessNFTFile(id: string) {
		try {
			const accessToken = await getAccessToken();
			const accessReq = await fetch(`/api/access/${id}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});
			const accessData = await accessReq.json();
			window.open(accessData.url);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (authenticated) {
			getNFTs();
		}
	}, [authenticated, getNFTs]);

	if (loading) {
		return (
			<div>
				<h1>Loading...</h1>
			</div>
		);
	}

	if (!loading && nfts.length === 0) {
		return (
			<div>
				<h1>No NFTs, make some now!</h1>
			</div>
		);
	}

	return (
		<div className="flex flex-col max-w-[500px] gap-4 items-center justify-start">
			{nfts.map((nft: NFT) => (
				<Card
					className="p-2 flex flex-col gap-2 overflow-hidden"
					key={nft.token_id}
				>
					<img
						className="max-w-sm"
						src={nft.image_url || "/pfp.png"}
						alt={nft.name}
					/>
					<div className="flex flex-col gap-2">
						<p className="text-xl font-bold">{nft.name}</p>
						<p>{nft.description}</p>
						<Button onClick={() => accessNFTFile(nft.token_id)}>
							Access File
						</Button>
					</div>
				</Card>
			))}
		</div>
	);
});
