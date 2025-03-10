import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus, Filter } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import DeletePerfumeModal from "@/components/DeletePerfumeModal";

import perfumeApi, { PerfumeData } from "@/api/perfume.api";
import brandApi, { BrandData } from "@/api/brand.api";
import { useDebounceValue } from "@/hooks/useDebounceValue";
import { formatCurrency } from "@/lib/utils";

const ManagePerfumesPage = () => {
  const navigate = useNavigate();
  const [perfumes, setPerfumes] = useState<PerfumeData[]>([]);
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [perfumeToDelete, setPerfumeToDelete] = useState<PerfumeData | null>(
    null
  );
  const [deletingPerfume, setDeletingPerfume] = useState(false);

  // Use our custom debounce hook with 500ms delay
  const [debouncedSearchTerms, setSearchTerms] = useDebounceValue("", 500);

  // Function to load perfumes with pagination, search and brand filter
  const loadPerfumes = async (
    page: number,
    search: string,
    brandId: string
  ) => {
    setLoading(true);
    try {
      const data = await perfumeApi.getAllPerfumes(page, 10, search, brandId);
      setPerfumes(data.perfumes);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      toast.error("Failed to load perfumes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load all brands for filter dropdown
  const loadBrands = async () => {
    try {
      // Load all brands (without pagination for the dropdown)
      const data = await brandApi.getAllBrands(1, 100);
      setBrands(data.brands);
    } catch (error) {
      toast.error("Failed to load brands");
      console.error(error);
    }
  };

  // Initial load
  useEffect(() => {
    loadBrands();
  }, []);

  // Reload when page, search or brand filter changes
  useEffect(() => {
    loadPerfumes(currentPage, debouncedSearchTerms, selectedBrand);
  }, [currentPage, debouncedSearchTerms, selectedBrand]);

  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setSearchTerms(e.target.value);
    // Reset to first page
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  // Handle brand filter change
  const handleBrandFilterChange = (value: string) => {
    setSelectedBrand(value);
    // Reset to first page
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handleEditPerfume = (perfumeId: string) => {
    navigate(`/admin/perfumes/${perfumeId}`);
  };

  const handleDeleteClick = (perfume: PerfumeData) => {
    setPerfumeToDelete(perfume);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!perfumeToDelete) return;
    setDeletingPerfume(true);

    try {
      await perfumeApi.deletePerfume(perfumeToDelete.id);
      toast.success(
        `Perfume "${perfumeToDelete.perfumeName}" deleted successfully`
      );
      // Reload the current page to update the list
      loadPerfumes(currentPage, debouncedSearchTerms, selectedBrand);
    } catch (error) {
      toast.error(
        error.response?.data?.errors?.[0]?.message || "Failed to delete perfume"
      );
    } finally {
      setDeletingPerfume(false);
      setDeleteModalOpen(false);
      setPerfumeToDelete(null);
    }
  };

  const renderPaginationItems = () => {
    const items = [];

    for (let i = 1; i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const renderAudienceBadge = (audience: string) => {
    switch (audience) {
      case "male":
        return <Badge variant="secondary">Men</Badge>;
      case "female":
        return <Badge variant="destructive">Women</Badge>;
      case "unisex":
        return <Badge variant="outline">Unisex</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Perfumes</h1>
        <Button onClick={() => navigate("/admin/perfumes/add")}>
          <Plus className="mr-2 h-4 w-4" /> Add New Perfume
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search perfumes..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex md:w-72 gap-2">
          <Select value={selectedBrand} onValueChange={handleBrandFilterChange}>
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

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Table>
            <TableCaption>A list of all perfumes</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Perfume Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {perfumes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No perfumes found
                  </TableCell>
                </TableRow>
              ) : (
                perfumes.map((perfume) => (
                  <TableRow key={perfume.id}>
                    <TableCell>
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <img
                          src={perfume.uri}
                          alt={perfume.perfumeName}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // Fallback for broken images
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/100x100?text=No+Image";
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {perfume.perfumeName}
                    </TableCell>
                    <TableCell>{perfume.brand.brandName}</TableCell>
                    <TableCell>{formatCurrency(perfume.price)}</TableCell>
                    <TableCell>{perfume.volume} ml</TableCell>
                    <TableCell>
                      {renderAudienceBadge(perfume.targetAudience)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={perfume.isActive ? "default" : "secondary"}
                      >
                        {perfume.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPerfume(perfume.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(perfume)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {perfumeToDelete && (
        <DeletePerfumeModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          perfumeName={perfumeToDelete.perfumeName}
          isLoading={deletingPerfume}
        />
      )}
    </div>
  );
};

export default ManagePerfumesPage;
