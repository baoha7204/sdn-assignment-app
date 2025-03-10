import { customAxios } from "@/config/axios";

export interface PerfumeData {
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

export interface PerfumeInput {
  perfumeName: string;
  uri: string;
  price: number;
  concentration: string;
  description?: string;
  ingredients?: string;
  volume: number;
  targetAudience: string;
  brand: string;
  isActive: boolean;
}

export interface PerfumePaginationResponse {
  perfumes: PerfumeData[];
  totalPages: number;
  currentPage: number;
  total: number;
}

const perfumeApi = {
  getAllPerfumes: async (page = 1, limit = 10, search = "", brandId = "") => {
    const response = await customAxios.get<PerfumePaginationResponse>(
      "/perfumes",
      {
        params: { page, limit, search, brandId },
      }
    );
    return response.data;
  },

  getPerfumeById: async (id: string) => {
    const response = await customAxios.get<PerfumeData>(`/perfumes/${id}`);
    return response.data;
  },

  createPerfume: async (perfumeData: PerfumeInput) => {
    const response = await customAxios.post<PerfumeData>(
      "/perfumes",
      perfumeData
    );
    return response.data;
  },

  updatePerfume: async (id: string, perfumeData: PerfumeInput) => {
    const response = await customAxios.put<PerfumeData>(
      `/perfumes/${id}`,
      perfumeData
    );
    return response.data;
  },

  deletePerfume: async (id: string) => {
    const response = await customAxios.delete(`/perfumes/${id}`);
    return response.data;
  },
};

export default perfumeApi;
