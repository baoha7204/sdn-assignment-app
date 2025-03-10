import { customAxios } from "@/config/axios";

export interface BrandData {
  id: string;
  brandName: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandInput {
  brandName: string;
}

export interface BrandPaginationResponse {
  brands: BrandData[];
  totalPages: number;
  currentPage: number;
  total: number;
}

const brandApi = {
  getAllBrands: async (page = 1, limit = 10, search = "") => {
    const response = await customAxios.get<BrandPaginationResponse>("/brands", {
      params: { page, limit, search },
    });
    return response.data;
  },

  getBrandById: async (id: string) => {
    const response = await customAxios.get<BrandData>(`/brands/${id}`);
    return response.data;
  },

  createBrand: async (brandData: BrandInput) => {
    const response = await customAxios.post<BrandData>("/brands", brandData);
    return response.data;
  },

  updateBrand: async (id: string, brandData: BrandInput) => {
    const response = await customAxios.put<BrandData>(
      `/brands/${id}`,
      brandData
    );
    return response.data;
  },

  deleteBrand: async (id: string) => {
    const response = await customAxios.delete(`/brands/${id}`);
    return response.data;
  },
};

export default brandApi;
