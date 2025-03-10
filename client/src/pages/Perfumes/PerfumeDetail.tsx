import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import perfumeApi from "@/api/perfume.api";

// Updated interface to match the actual model
interface Perfume {
  id: string;
  perfumeName: string;
  uri: string;
  price: number;
  concentration: string;
  description?: string;
  ingredients?: string;
  volume: number;
  targetAudience: string;
  brand: {
    id: string;
    brandName: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PerfumeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [perfume, setPerfume] = useState<Perfume | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerfumeDetails = async () => {
      try {
        setLoading(true);
        const data = await perfumeApi.getPerfumeById(id);
        setPerfume(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching perfume details:", error);
        setError("Failed to load perfume details");
        setLoading(false);
      }
    };

    if (id) {
      fetchPerfumeDetails();
    }
  }, [id]);

  const getConcentrationBadge = (concentration: string) => {
    if (concentration.includes("extrait de Parfum")) {
      return (
        <Badge className="bg-purple-600 hover:bg-purple-800">
          Extrait de Parfum
        </Badge>
      );
    } else if (concentration.includes("eau de Parfum")) {
      return <Badge className="bg-red-500 hover:bg-red-700">EDP</Badge>;
    } else if (concentration.includes("eau de Toilette")) {
      return <Badge className="bg-blue-500 hover:bg-blue-700">EDT</Badge>;
    } else if (concentration.includes("eau de Cologne")) {
      return <Badge className="bg-green-500 hover:bg-green-700">EDC</Badge>;
    } else if (concentration.includes("eau Fraiche")) {
      return (
        <Badge className="bg-teal-500 hover:bg-teal-700">Eau Fraiche</Badge>
      );
    } else {
      return <Badge>{concentration}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !perfume) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-xl text-red-500">{error || "Perfume not found"}</p>
        <Button asChild className="mt-4">
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/">← Back to Perfumes</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
          <img
            src={perfume.uri}
            alt={perfume.perfumeName}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="mb-6">
            <Link to={`/brands/${perfume.brand.id}`}>
              <h3 className="text-lg text-muted-foreground hover:underline">
                {perfume.brand.brandName}
              </h3>
            </Link>
            <h1 className="text-4xl font-bold">{perfume.perfumeName}</h1>

            <div className="flex items-center gap-3 mt-2">
              {getConcentrationBadge(perfume.concentration)}
              <Badge variant="outline">{perfume.targetAudience}</Badge>
              <Badge variant="outline">{perfume.volume} ml</Badge>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-2xl font-bold mb-4">
              ${perfume.price?.toFixed(2) || "N/A"}
            </p>
            {perfume.description && (
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {perfume.description}
              </p>
            )}
          </div>

          {perfume.ingredients && (
            <Card className="mb-6">
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {perfume.ingredients}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfumeDetailPage;
