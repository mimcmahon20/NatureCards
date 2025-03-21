"use client";

import { useEffect, useState } from "react";
import { FeedCard } from "@/components/FeedCard";
import { CardPost, fetchFeedData } from "@/lib/feed";

export default function Feed() {
  const [posts, setPosts] = useState<CardPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFeedData = async () => {
      setLoading(true);
      try {
        const data = await fetchFeedData();
        setPosts(data.posts);
      } catch (error) {
        console.error("Failed to fetch feed data:", error);
      } finally {
        setLoading(false);
      }
    };

    getFeedData();
  }, []);

  return (
    <div className="container mx-auto px-4 pt-6 pb-24">
      <h1 className="text-2xl font-bold mb-6">Nature Cards Feed</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No posts found in the feed</p>
        </div>
      )}
    </div>
  );
}
