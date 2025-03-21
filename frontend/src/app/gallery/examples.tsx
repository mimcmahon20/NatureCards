"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function GalleryExamples() {
  const exampleUsers = [
    { id: "12345", name: "Nature Lover" },
    { id: "67890", name: "Forest Explorer" },
    { id: "24680", name: "Butterfly Collector" }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Example User Galleries</h2>
      <p className="text-gray-600 mb-4">
        Click on a user to see their card collection:
      </p>
      <div className="flex flex-wrap gap-2">
        <Link href="/gallery">
          <Button variant="outline">Your Gallery</Button>
        </Link>
        {exampleUsers.map(user => (
          <Link 
            key={user.id} 
            href={`/gallery?userid=${user.id}`}
          >
            <Button variant="outline">{user.name}</Button>
          </Link>
        ))}
      </div>
    </div>
  );
} 