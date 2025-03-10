import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PerfumeConcentration } from "@/lib/constants";
import brandApi, { BrandData } from "@/api/brand.api";
import perfumeApi, { PerfumeData } from "@/api/perfume.api";
import { Filter } from "lucide-react";
import { useDebounceValue } from "@/hooks/useDebounceValue";

const HomePage = () => {
  const [perfumes, setPerfumes] = useState<PerfumeData[]>([]);
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  // Use our custom debounce hook with 500ms delay
  const [debouncedSearchTerms, setSearchTerms] = useDebounceValue("", 500);

  useEffect(() => {
    const fetchPerfumes = async () => {
      setLoading(true);
      try {
        const data = await perfumeApi.getAllPerfumes(
          currentPage,
          12,
          debouncedSearchTerms,
          selectedBrand
        );
        setPerfumes(data.perfumes);
        setTotalPages(Math.ceil(data.total / 12));
      } catch (error) {
        console.error("Error fetching perfumes:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBrands = async () => {
      try {
        const data = await brandApi.getAllBrands(1, 100);
        setBrands(data.brands);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchPerfumes();
    fetchBrands();
  }, [debouncedSearchTerms, selectedBrand, currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(e.target.value);
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleBrandChange = (value: string) => {
    setSelectedBrand(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getConcentrationBadge = (concentration: string) => {
    switch (concentration) {
      case PerfumeConcentration.EXTRACT_DE_PARFUM:
        return (
          <Badge className="bg-purple-600 hover:bg-purple-800">Extrait</Badge>
        );
      case PerfumeConcentration.EAU_DE_PARFUM:
        return <Badge className="bg-red-500 hover:bg-red-700">EDP</Badge>;
      case PerfumeConcentration.EAU_DE_TOILETTE:
        return <Badge className="bg-blue-500 hover:bg-blue-700">EDT</Badge>;
      case PerfumeConcentration.EAU_DE_COLOGNE:
        return <Badge className="bg-green-500 hover:bg-green-700">EDC</Badge>;
      default:
        return <Badge>{concentration}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Explore Our Perfumes</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-2/3">
            <Input
              placeholder="Search perfumes..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full"
            />
          </div>

          <div className="flex md:w-1/3 gap-2">
            <Select value={selectedBrand} onValueChange={handleBrandChange}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.brandName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setSelectedBrand("")}>
              <Filter className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          {perfumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {perfumes.map((perfume) => (
                <Link to={`/perfumes/${perfume.id}`} key={perfume.id}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={perfume.uri}
                        alt={perfume.perfumeName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold">
                        {perfume.perfumeName}
                      </h2>
                      <p className="text-muted-foreground">
                        {perfume.brand.brandName}
                      </p>
                      <p className="mt-2">For: {perfume.targetAudience}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="text-lg font-bold">
                        ${perfume.price?.toFixed(2) || "N/A"}
                      </div>
                      <div>{getConcentrationBadge(perfume.concentration)}</div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl">
                No perfumes found. Try adjusting your search.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
