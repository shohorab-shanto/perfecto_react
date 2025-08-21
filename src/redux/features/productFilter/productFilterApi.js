import {baseApi} from "../../api/baseApi";

const productFilterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        productListWithCategory: builder.mutation({
            query: (data) => {
                return {
                    url: `https://node.perfectobd.com/api/node/products-cat?page=${data?.pageNumber}`,
                    method: "POST",
                    body: data,
                }
            },
        }),
        productListWithFilter: builder.mutation({
            query: (data) => {
                return {
                    url: `https://node.perfectobd.com/api/node/products?page=${data?.pageNumber}`,
                    method: "POST",
                    body: data,
                }
            },
        }),
        trendingSearch: builder.mutation({
            query: (data) => {
                return {
                    url: `trending-search`,
                    method: "POST",
                    body: data,
                }
            },
        }),
        searchNameList: builder.mutation({
            query: (data) => {
                return {
                    url: `products-name`,
                    method: "POST",
                    body: data,
                }
            },
        }),
        brandList: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/brand", // brand
                method: "GET",
            }),
        }),
        colorList: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/color", //product/color
                method: "GET",
            }),
        }),
        categoryList: builder.query({
            query: () => ({
                url: "category",
                method: "GET",
            }),
        }),
        preferenceList: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/preference",
                method: "GET",
            }),
        }),
        formulationList: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/formulation",
                method: "GET",
            }),
        }),
        finishList: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/finish",
                method: "GET",
            }),
        }),
        countryList: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/country",
                method: "GET",
            }),
        }),
        genderList: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/gender",
                method: "GET",
            }),
        }),
        coverageList: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/coverage",
                method: "GET",
            }),
        }),
        skinTypeList: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/skin-type",
                method: "GET",
            }),
        }),
        benefitList: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/benefit",
                method: "GET",
            }),
        }),
        concernList: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/concern",
                method: "GET",
            }),
        }),
        ingredientList: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/ingredient",
                method: "GET",
            }),
        }),
        packSizeList: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/pack-size",
                method: "GET",
            }),
        }),
    }),
});

export const {
    useProductListWithCategoryMutation,
    useProductListWithFilterMutation,
    useTrendingSearchMutation,
    useSearchNameListMutation,
    useBrandListQuery,
    useColorListQuery,
    useCategoryListQuery,
    usePreferenceListQuery,
    useFormulationListQuery,
    useFinishListQuery,
    useCountryListQuery,
    useGenderListQuery,
    useCoverageListQuery,
    useSkinTypeListQuery,
    useBenefitListQuery,
    useConcernListQuery,
    useIngredientListQuery,
    usePackSizeListQuery,
} = productFilterApi;
