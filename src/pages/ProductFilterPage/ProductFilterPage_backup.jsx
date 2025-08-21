import {Drawer, Pagination, Skeleton, Space} from "antd";
import React, {useContext, useEffect, useState} from "react";
import {HiOutlineMenuAlt2} from "react-icons/hi";
import {IoClose} from "react-icons/io5";
import {Bars} from "react-loader-spinner";
import {ScrollRestoration, useLocation, useNavigate, useParams} from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import MainButton from "../../components/Buttons/MainButton/MainButton";
import SlimSlider from "../../components/SlimSlider/SlimSlider";
import CenterAlignCard from "../../components/allCards/CenterAlignCard/CenterAlignCard";
import {useProductListWithCategoryMutation, useProductListWithFilterMutation} from "../../redux/features/productFilter/productFilterApi";
import LeftSideFilterArea from "./LeftSideFilterArea/LeftSideFilterArea";
import {LogicProviderContext} from "../../providers/LogicProvider";
import CardSkeleton from "../../components/allCards/CardSkeleton/CardSkeleton";
import CardSkeletonLoading from "./CardSkeletonLoading/CardSkeletonLoading";
import {useCategoryListQuery} from "../../redux/features/categoryList/categoryListApi";
// useBrandListQuery
import {useBrandListQuery} from "../../redux/features/productFilter/productFilterApi";
import ImageURL from "../../components/ImageURL/ImageURL.jsx";
import CenterAlignCardFilter from "../../components/allCards/CenterAlignCard/CenterAlignCardFilter.jsx";

const ProductFilterPage = ({link, topArea = true}) => {
    const [current, setCurrent] = useState(1);
    const location = useLocation();
    const navigate = useNavigate();
    const [ProductListWithCategoryMutation, {isLoading: initialProductListLoading}] = useProductListWithCategoryMutation();
    const [ProductListWithFilterMutation, {isLoading: filteredProductListLoading}] = useProductListWithFilterMutation();
    const {data: categoryList, error, isLoading: isCategoryListLoading} = useCategoryListQuery();
    const {data: brandList, error: brandError, isLoading: isBrandListLoading} = useBrandListQuery();
    const [productData, setProductData] = useState([]);
    const [filterStarRatings, setFilterStarRatings] = useState({});
    const [sortedValue, setSortedValue] = useState("");
    const [category, setCategory] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [price, setPrice] = useState([]);
    const [avgCustomerRating, setAvgCustomerRating] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [maxMin, setMaxMin] = useState([]);
    const [formulation, setFormulation] = useState([]);
    const [country, setCountry] = useState([]);
    const [skinType, setSkinType] = useState([]);
    const [coverage, setCoverage] = useState([]);
    const [preference, setPreference] = useState([]);
    const [finish, setFinish] = useState([]);
    const [gender, setGender] = useState([]);
    const [averageRating, setAverageRating] = useState([]);
    const [Benefit, setBenefit] = useState([]);
    const [concern, setConcern] = useState([]);
    const [ingredient, setIngredient] = useState([]);
    const [packSize, setPackSize] = useState([]);
    const [productCount, setProductCount] = useState(0);
    const {paginationValue} = useContext(LogicProviderContext);
    const [pagination, setPagination] = useState(paginationValue);
    const [pageNumber, setPageNumber] = useState(1);
    let totalPage = Math.ceil(productCount / pagination);
    const {categoryId, subCategoryId, childCategoryId, brandId} = useParams();

    const onChange = (page) => {
        setCurrent(page);
        setPageNumber(page);
        // window.scrollTo(0, 0);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth", // Smooth scrolling animation
        });
    };

    // Convert string array elements to numbers
    const ratings = avgCustomerRating?.map((item) => parseInt(item));

    const minRating = Math?.min(...ratings);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams?.size > 0) {
            setPageNumber(1);
        }
    }, [location.search]);


    const paginationStyles = {
        borderRadius: "20px", // Adjust the border-radius value as needed
    };

    const useQueryParamState = (paramName, setStateFunction, isNumber) => {
        useEffect(() => {
            const searchParams = new URLSearchParams(location.search);
            const paramValues = searchParams.getAll(paramName.toLowerCase());
            setStateFunction(paramValues.map((value) => parseInt(value, 10)));

            if (isNumber) {
                setStateFunction(paramValues.map((value) => parseInt(value, 10)));
            } else {
                setStateFunction(paramValues.map((value) => value));
            }
        }, [location.search, paramName, setStateFunction]);
    };
    // Use the custom hook for each state variable
    // price list start
    const priceList = [
        {
            id: 1,
            name: "0 - 499",
        },
        {
            id: 2,
            name: "500 - 999",
        },
        {
            id: 3,
            name: "1000 - 1499",
        },
        {
            id: 4,
            name: "1500 - 1999",
        },
        {
            id: 5,
            name: "2000 & Above",
        },
    ];
    const getPriceRangeNumbers = (priceSelectedId) => {
        const selectedRanges = priceList.filter((range) => priceSelectedId.includes(String(range.id)));
        const minPrice = Math.min(...selectedRanges.map((range) => parseInt(range.name.split(" - ")[0])));
        let maxPrice = Math.max(...selectedRanges.map((range) => parseInt(range.name.split(" - ")[1])));
        if (isNaN(maxPrice)) {
            maxPrice = 2001;
        }
        return [minPrice, maxPrice];
    };
    const minMaxValue = getPriceRangeNumbers(price);
    // price list end

    useQueryParamState("Category", setCategory);
    useQueryParamState("Brand", setSelectedBrands);
    useQueryParamState("price", setPrice);
    useQueryParamState("Avg Customer Rating", setAvgCustomerRating);
    useQueryParamState("color", setSelectedColors);
    useQueryParamState("search-value", setSearch);
    useQueryParamState("size", setSelectedSizes);
    useQueryParamState("MaxMin", setMaxMin);
    useQueryParamState("formulation", setFormulation);
    useQueryParamState("country", setCountry);
    useQueryParamState("Skin type", setSkinType);
    useQueryParamState("coverage", setCoverage);
    useQueryParamState("preference", setPreference);
    useQueryParamState("finish", setFinish);
    useQueryParamState("gender", setGender);
    useQueryParamState("average_rating", setAverageRating);
    useQueryParamState("benefit", setBenefit);
    useQueryParamState("concern", setConcern);
    useQueryParamState("ingredient", setIngredient);
    useQueryParamState("Pack size", setPackSize);
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");
    const searchValue = searchParams.get("search-value");
    // const topBannerForCategory = categoryList?.data?.find((item) => item?.id == categoryParam);
    const [topBannerForCategory, setTopBannerForCategory] = useState([]);

    function findById(arr, id) {

        for (let obj of arr) {
            if (obj?.id == id) {
                return obj;
            }
            if (obj?.subcategory?.length) {
                const result = findById(obj?.subcategory, id);

                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    useEffect(() => {
        // get params first query
        const searchParams = new URLSearchParams(location.search);
        const selectedCheckboxValue = searchParams.get("sort_by");
        setSortedValue(selectedCheckboxValue);

    }, []);

    useEffect(() => {
        if (categoryList?.status) {
            const result = findById(categoryList?.data, category?.[0] ? category?.[0] : subCategoryId ? subCategoryId : childCategoryId);
            setTopBannerForCategory(result);
        }
    }, [categoryList, category?.[0], subCategoryId, childCategoryId]);

    // 
    const fetchFilteredProductListData = async (pageNum) => {
        setCurrent(pageNum);
        setPageNumber(pageNum);
        const filterList = {
            sorting: `${sortedValue?.toLowerCase()}`,
            category: JSON.stringify(categoryParam ? [categoryId, ...category] : []),
            // subcategory: JSON.stringify(subCategoryId == undefined ? [] : [subCategoryId]),
            // child_category: JSON.stringify(childCategoryId == undefined ? [] : [childCategoryId]),
            // brand: JSON.stringify(selectedBrands),
            brand: JSON.stringify(brandParam ? [brandId, ...selectedBrands] : []),
            color: JSON.stringify(selectedColors),
            // search: search?.[0], // old system
            search: searchValue,
            size: JSON.stringify(selectedSizes),
            max_min: JSON.stringify(minMaxValue?.[0] == Infinity ? [] : minMaxValue),
            pagination: pagination,
            // sort_by_name: JSON.stringify([1]),
            // sort_by_price: JSON.stringify([1]),
            formulation: JSON.stringify(formulation),
            country: JSON.stringify(country),
            skin_type: JSON.stringify(skinType),
            coverage: JSON.stringify(coverage),
            preference: JSON.stringify(preference),
            finish: JSON.stringify(finish),
            gender: JSON.stringify(gender),
            ...(minRating !== Infinity && {average_rating: minRating}),
            // average_rating: minRating == Infinity ? [] : minRating,
            benefit: JSON.stringify(Benefit),
            concern: JSON.stringify(concern),
            ingredient: JSON.stringify(ingredient),
            pack_size: JSON.stringify(packSize),
            pageNumber: pageNum,
        };
        try {
            const response = await ProductListWithFilterMutation(filterList);
            // Uncomment and use the response data if needed
            setProductData(response?.data?.data?.products?.data);
            setFilterStarRatings(response?.data?.data?.starCounts);
            setProductCount(response?.data?.data?.products?.total);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };
    const fetchProductListData = async (pageNum) => {
        const productListBody = {
            category: JSON.stringify(categoryId == undefined ? [] : [categoryId]),
            subcategory: JSON.stringify(subCategoryId == undefined ? [] : [subCategoryId]),
            child_category: JSON.stringify(childCategoryId == undefined ? [] : [childCategoryId]),
            sorting: `${sortedValue?.toLowerCase()}`,
            pagination: pagination,
            pageNumber: pageNum,
        };

        try {
            const response = await ProductListWithCategoryMutation(productListBody);
            setProductData(response?.data?.data?.products?.data);
            setFilterStarRatings(response?.data?.data?.starCounts);
            setProductCount(response?.data?.data?.products?.total);
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams?.size > 0) {
            fetchFilteredProductListData(pageNumber);
        } else {
            fetchProductListData(pageNumber);
        }
    }, [ProductListWithFilterMutation, ProductListWithCategoryMutation, selectedBrands, pageNumber, categoryId, subCategoryId, childCategoryId, brandId]);

    // useEffect(() => {
    //     const searchParams = new URLSearchParams(location.search);
    //     if (searchParams?.size > 0) {
    //
    //         fetchFilteredProductListData(pageNumber);
    //     } else {
    //
    //         fetchProductListData(pageNumber);
    //     }
    // }, [pageNumber]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const selectedCheckboxValue = searchParams.get("sort_by");
        // setSortedValue(selectedCheckboxValue || "Discount");
        setSortedValue(selectedCheckboxValue);
        //
    }, [location.search]);

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };

    // rating filter start

    const [starRatingList, setStarRatingList] = useState([]);

    // Check if filterStarRatings is defined and not null

    useEffect(() => {
        if (filterStarRatings && typeof filterStarRatings === "object") {
            // Reverse the entries of filterStarRatings and convert them back to an object
            const reversedFilterStarRatings = Object.fromEntries(Object.entries(filterStarRatings).reverse());

            // Map the reversed entries to starRatingList
            const starRatingList = Object.keys(reversedFilterStarRatings).map((key, index) => ({
                id: index + 1,
                name: key,
                products_count: reversedFilterStarRatings[key],
            }));

            // Now you can use starRatingList
            setStarRatingList(starRatingList);
        } else {
            console.error("filterStarRatings is undefined or null.");
        }
    }, [filterStarRatings]);
    //
    // rating filter end

    // if (initialProductListLoading) {
    //     return (
    //         <div className="flex justify-center items-center min-h-[calc(100vh-55vh)]">
    //             <Bars height="40" width="80" color="#5DC9F4" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" visible={true} />
    //         </div>
    //     );
    // }


    const [bannerType, setBannerType] = useState("");
    const [topBannerForBrand, setTopBannerForBrand] = useState([]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const firstEntry = searchParams.entries().next().value;
        if (firstEntry) {
            const [firstKey, firstValue] = firstEntry;
            if (firstKey === 'category') {
                console.log('category', firstValue);
                setBannerType('category');
            } else if (firstKey === 'brand') {
                console.log('brand', firstValue);
                setBannerType('brand');
                const result = brandList?.data?.find((item) => item?.id == firstValue);
                setTopBannerForBrand(result);
            }
        }else {
            setBannerType('category');
        }
    }, [location.search, brandList]);

    return (
        <div className="px-[10px] container mx-auto">
            {topArea && (
                <>
                    <Breadcrumbs className={"mt-2 mb-1 md:my-4"} first={"Home"} second={"Product Search"}/>
                    {/*<h3 className="text-black text-center font-inter text-base md:text-[20px] font-semibold leading-normal mb-1 md:mb-4">Buy Skincare Products Online</h3>*/}
                    <SlimSlider dots={true}/>
                </>
            )}

            {/* category banner start */}
            {
                bannerType === 'category' && topBannerForCategory?.banner?.length > 0 && (
                    <div className=" md:mb-4 container mx-auto">
                        <SlimSlider dots={false} item={topBannerForCategory?.banner}/>
                    </div>
                )

            }

            {
                bannerType === 'brand' && brandList?.data?.length > 0 && (
                    <div className=" md:mb-4 container mx-auto">
                        <ImageURL className="w-full h-full object-fill" image={topBannerForBrand?.banner}/>
                    </div>
                )
            }

            {/* category banner end*/}

            {/* left side for mobile menu start */}
            <div className="block md:hidden">
                <Drawer
                    title="Product Filter"
                    placement={"bottom"}
                    // width={500}
                    height={"75%"}
                    closable={false}
                    onClose={onClose}
                    open={open}
                    extra={
                        <Space>
                            <button className="mt-2" onClick={onClose}>
                                <IoClose size={22}/>
                            </button>
                        </Space>
                    }
                >
                    {/* left side menu start */}
                    <div className="md:w-[47%] lg:w-[35%] xl:w-[30%] 2xl:w-[25%] p-2 rounded bg-[#F3F3F3]" style={{boxShadow: "0px 0px 6px 0px #E4EDF0"}}>
                        <LeftSideFilterArea starRatingList={starRatingList}/>
                    </div>
                    {/* left side menu end*/}
                </Drawer>
                <div className="z-10">
                    <MainButton title={<HiOutlineMenuAlt2/>} handleSubmit={showDrawer} className={"px-4 py-2 mt-3 z-20"}/>
                </div>
                {/* <Button type="primary" onClick={showDrawer}>
          Open
        </Button> */}
            </div>
            {/* left side for mobile menu end */}
            {/* filter and products start */}
            <div className="flex gap-3 mt-2 md:mt-8">
                {/* left side menu start */}
                <div className="hidden md:block md:w-[47%] lg:w-[35%] xl:w-[30%] 2xl:w-[25%] p-2 rounded bg-[#F3F3F3]" style={{boxShadow: "0px 0px 6px 0px #E4EDF0"}}>
                    <LeftSideFilterArea starRatingList={starRatingList}/>
                </div>
                {/* left side menu end*/}
                {/* right side products start*/}
                <div className="w-full">
                    <div className="rounded bg-white py-3 ps-5 w-full mb-3" style={{boxShadow: "0px 0px 6px 0px #E4EDF0"}}>
                        <p>{productCount} Products Found</p>
                    </div>
                    {initialProductListLoading ? (
                        <div className="flex justify-center items-center min-h-[calc(100vh-55vh)]">
                            {/* <Bars height="40" width="80" color="#5DC9F4" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" visible={true} /> */}
                            <CardSkeletonLoading/>
                        </div>
                    ) : filteredProductListLoading ? (
                        <div className="flex justify-center items-center min-h-[calc(100vh-55vh)]">
                            {/* <Bars height="40" width="80" color="#5DC9F4" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" visible={true} /> */}
                            <CardSkeletonLoading/>
                        </div>
                    ) : (
                        <div className="min-h-[calc(100vh-70vh)]">
                            {productData?.length > 0 ? (
                                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 md:gap-5 min-h-[calc(100vh-90vh)]">
                                    {productData?.map((item, i) => (
                                        <CenterAlignCardFilter key={i} item={item}/>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center flex justify-center items-center text-red-400 text-xl">No product found</p>
                            )}
                        </div>
                    )}

                    <div className="w-full my-5 lg:my-14 flex flex-col gap-y-2 md:flex-row justify-between items-center">
                        <p className="text-sm font-medium">
                            Page {pageNumber} of {totalPage}
                        </p>
                        <Pagination showSizeChanger={false} current={current} onChange={onChange} pageSize={pagination} total={productCount} style={paginationStyles}/>
                        <p></p>
                    </div>
                </div>
                {/* right side products end*/}
            </div>
            {/* filter and products end */}
            {/* ScrollRestoration start */}
            {/* {location?.search ? (
                ""
            ) : (
                <div>
                    <ScrollRestoration />
                </div>
            )} */}
            {/* <ScrollRestoration /> */}
            {/* ScrollRestoration end */}
        </div>
    );
};

export default ProductFilterPage;
