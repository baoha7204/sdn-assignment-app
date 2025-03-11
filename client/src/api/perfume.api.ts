import { customAxios } from "@/config/axios";

export interface CommentData {
  _id: string;
  rating: number;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CommentInput {
  rating: number;
  content: string;
}

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
  comments: CommentData[];
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

  // Comment-related API functions
  addComment: async (perfumeId: string, commentData: CommentInput) => {
    const response = await customAxios.post<PerfumeData>(
      `/perfumes/${perfumeId}/comments`,
      commentData
    );
    return response.data;
  },

  updateComment: async (
    perfumeId: string,
    commentId: string,
    commentData: CommentInput
  ) => {
    const response = await customAxios.put<PerfumeData>(
      `/perfumes/${perfumeId}/comments/${commentId}`,
      commentData
    );
    return response.data;
  },

  deleteComment: async (perfumeId: string, commentId: string) => {
    const response = await customAxios.delete<PerfumeData>(
      `/perfumes/${perfumeId}/comments/${commentId}`
    );
    return response.data;
  },
};

export default perfumeApi;
