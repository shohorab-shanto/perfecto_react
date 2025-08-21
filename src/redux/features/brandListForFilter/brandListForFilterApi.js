import {baseApi} from "../../api/baseApi";

const brandListForFilterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        brandListForFilter: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/brand-format",
                method: "GET",
            }),
        }),
        topBrandListForFilter: builder.query({
            query: () => ({
                url: "https://node.perfectobd.com/api/node/top-brand",
                method: "GET",
            }),
        }),
    }),
});

export const {useBrandListForFilterQuery, useTopBrandListForFilterQuery} = brandListForFilterApi;
