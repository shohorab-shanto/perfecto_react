import { Fragment } from "react";
import { Link, ScrollRestoration } from "react-router-dom";
import CardCarousel from "../../components/CardCarousel/CardCarousel";
import ImageURL from "../../components/ImageURL/ImageURL";
import SlimSlider from "../../components/SlimSlider/SlimSlider";
import BrandCard from "../../components/allCards/BrandCard/BrandCard";
import CenterAlignCard from "../../components/allCards/CenterAlignCard/CenterAlignCard";
import DiscountCardForSlider from "../../components/allCards/DiscountCardForSlider/DiscountCardForSlider";
import EggCard from "../../components/allCards/EggCard/EggCard";
import useHomeData from "../../hooks/useHomeData";
import Carousel from "./Carousel/Carousel";
import HomeSkeleton from "./HomeSkeleton/HomeSkeleton";
import SwiperSlider from "../../components/SwiperSlider/SwiperSlider";
import { SwiperSlide } from "swiper/react";
import { useBenefitListQuery, useBrandListQuery, useCategoryListQuery, useColorListQuery, useConcernListQuery, useCountryListQuery, useCoverageListQuery, useFinishListQuery, useFormulationListQuery, useGenderListQuery, useIngredientListQuery, usePackSizeListQuery, usePreferenceListQuery, useSkinTypeListQuery } from "../../redux/features/productFilter/productFilterApi";

const Home = () => {
    //   const { data: homeData, isLoading, isError } = useHomeQuery();
    const { homeData, isLoading, isError, error } = useHomeData();

    // Check if we're in Facebook iOS browser
    const isFacebookBrowser = () => {
        const userAgent = navigator.userAgent || '';
        return /FBAN|FBAV|Instagram|FB_IAB|FB4A|FBIOS|FBANDROID/.test(userAgent);
    };
    const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isFacebookIOSBrowser = isFacebookBrowser() && isIOS();

    // caching data for filter page start - make these non-blocking
    // Use skip to prevent these from blocking the main content
    const skipFilters = isLoading || isFacebookIOSBrowser;

    const { data: brandList } = useBrandListQuery(undefined, {
        skip: skipFilters,
        retry: isFacebookIOSBrowser ? 1 : 3
    });
    const { data: colorList } = useColorListQuery(undefined, {
        skip: skipFilters,
        retry: isFacebookIOSBrowser ? 1 : 3
    });
    const { data: categoryList } = useCategoryListQuery(undefined, {
        skip: skipFilters,
        retry: isFacebookIOSBrowser ? 1 : 3
    });
    const { data: preferenceList } = usePreferenceListQuery(undefined, {
        skip: skipFilters,
        retry: isFacebookIOSBrowser ? 1 : 3
    });
    const { data: formulationList } = useFormulationListQuery(undefined, {
        skip: skipFilters,
        retry: isFacebookIOSBrowser ? 1 : 3
    });
    const { data: finishList } = useFinishListQuery(undefined, {
        skip: skipFilters,
        retry: isFacebookIOSBrowser ? 1 : 3
    });
    const { data: countryList } = useCountryListQuery(undefined, {
        skip: skipFilters,
        retry: isFacebookIOSBrowser ? 1 : 3
    });
    const { data: genderList } = useGenderListQuery(undefined, {
        skip: skipFilters,
        retry: isFacebookIOSBrowser ? 1 : 3
    });
    const { data: coverageList } = useCoverageListQuery(undefined, {
        skip: skipFilters,
        retry: isFacebookIOSBrowser ? 1 : 3
    });
    const { data: skinTypeList } = useSkinTypeListQuery(undefined, {
        skip: skipFilters,
        retry: isFacebookIOSBrowser ? 1 : 3
    });
    const { data: benefitList } = useBenefitListQuery(undefined, {
        skip: skipFilters,
        retry: isFacebookIOSBrowser ? 1 : 3
    });
    const { data: concernList } = useConcernListQuery(undefined, {
        skip: skipFilters,
        retry: isFacebookIOSBrowser ? 1 : 3
    });
    const { data: ingredientList } = useIngredientListQuery(undefined, {
        skip: skipFilters,
        retry: isFacebookIOSBrowser ? 1 : 3
    });
    const { data: packSizeList } = usePackSizeListQuery(undefined, {
        skip: skipFilters,
        retry: isFacebookIOSBrowser ? 1 : 3
    });
    // caching data for filter page end

    // Log filter loading status for debugging
    if (isFacebookIOSBrowser) {
        console.log('Facebook iOS browser detected - filters skipped to prevent blocking');
    }

    if (isLoading) {
        return (
            // <div className="flex justify-center items-center min-h-[calc(100vh-55vh)]">
            //   <Bars height="40" width="80" color="#5DC9F4" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" visible={true} />
            // </div>
            <HomeSkeleton />
        );
    }

    // Better handling for when Node API fails but we have fallback data
    if (isError && (!homeData || !homeData.data || homeData.data.length === 0)) {
        return (
            <div className="my-container md:pt-5">
                <div className="flex flex-col justify-center items-center min-h-[50vh] px-4">
                    <div className="text-center max-w-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Welcome to Perfecto
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We're having trouble loading the homepage content right now.
                            You can still browse our products and shop!
                        </p>
                        {isFacebookIOSBrowser && (
                            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded text-yellow-800 text-sm">
                                <strong>Facebook Browser Notice:</strong> Some features may be limited.
                                For the best experience, please use "Open in Browser" below.
                            </div>
                        )}
                        <div className="space-y-3">
                            <Link
                                to="/product-filter"
                                className="block w-full bg-[#5DC9F4] text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                            >
                                Browse Products
                            </Link>
                            <button
                                onClick={() => window.location.reload()}
                                className="block w-full bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                            >
                                Try Again
                            </button>
                            <Link
                                to="/diagnostics"
                                className="block w-full bg-orange-500 text-white py-2 px-4 rounded text-sm hover:bg-orange-600 transition-colors"
                            >
                                Run Diagnostics
                            </Link>
                            <button
                                onClick={() => window.open('https://perfectobd.com', '_blank')}
                                className="block w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors"
                            >
                                Open in Browser
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If we have some data or fallback empty data, render normally
    return (
        <div className="my-container md:pt-5">
            {homeData?.data?.length > 0 ? (
                homeData.data.map((item, index) => (
                    <Fragment key={index}>
                        {item?.id == 1 && item?.section_data?.length > 0 && (
                            <div className=" mb-10 px-[10px] container mx-auto">
                                <Carousel items={item} />
                            </div>
                        )}
                        {item?.id == 2 && item?.section_data?.length > 0 && (
                            <div className="mb-4 md:mb-10 container mx-auto">
                                <CardCarousel
                                    defaultSlidesToShow={item?.section_data?.length >= 3 ? 3 : item?.section_data?.length}
                                    slidesToShowFor540={item?.section_data?.length >= 1 ? 1 : item?.section_data?.length}
                                    slidesToShowFor640={item?.section_data?.length >= 2 ? 2 : item?.section_data?.length}
                                    slidesToShowFor768={item?.section_data?.length >= 2 ? 2 : item?.section_data?.length}
                                    slidesToShowFor1024={item?.section_data?.length >= 2 ? 2 : item?.section_data?.length}
                                    slidesToShowFor1280={item?.section_data?.length >= 3 ? 3 : item?.section_data?.length}
                                    slidesToShowFor1536={item?.section_data?.length >= 3 ? 3 : item?.section_data?.length}
                                >
                                    {item?.section_data?.map((product, i) => (
                                        <div key={i} className="min-w-min px-[10px]">
                                            <DiscountCardForSlider key={i} item={product} />
                                        </div>
                                    ))}
                                </CardCarousel>
                            </div>
                        )}
                        {item?.id == 3 && item?.section_data?.length > 0 && (
                            <div className="mb-4 md:mb-10  px-[10px] container mx-auto">
                                <h4 className="text-black font-inter text-[20px] font-semibold leading-normal mb-2 md:mb-4">{item.title}</h4>
                                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-3">
                                    {item?.section_data?.slice(0, 6).map((item, i) => (
                                        <div key={i} className="min-w-min">
                                            <BrandCard item={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {item?.id == 9 && item?.section_data?.length > 0 && (
                            <div className="mb-4 md:mb-10 px-[10px] bg-[#FFF2F7]">
                                <div className="container mx-auto py-5">
                                    <h4 className="text-black px-[10px] font-inter text-[20px] font-semibold leading-normal mb-2 md:mb-4">{item.title}</h4>
                                    <CardCarousel
                                        defaultSlidesToShow={item?.section_data?.length >= 3 ? 3 : item?.section_data?.length}
                                        slidesToShowFor540={item?.section_data?.length >= 1 ? 1 : item?.section_data?.length}
                                        slidesToShowFor640={item?.section_data?.length >= 2 ? 2 : item?.section_data?.length}
                                        slidesToShowFor768={item?.section_data?.length >= 2 ? 2 : item?.section_data?.length}
                                        slidesToShowFor1024={item?.section_data?.length >= 2 ? 2 : item?.section_data?.length}
                                        slidesToShowFor1280={item?.section_data?.length >= 3 ? 3 : item?.section_data?.length}
                                        slidesToShowFor1536={item?.section_data?.length >= 3 ? 3 : item?.section_data?.length}
                                    >
                                        {item?.section_data?.map((item, i) => (
                                            <Link
                                                key={i}
                                                className="min-w-min px-[10px] min-h-[100px] flex justify-center items-center"
                                                to={
                                                    item?.type === "Category"
                                                        ? `/product-filter?category=${item?.category?.id}`
                                                        : item?.type === "Brand"
                                                            ? `/product-filter?brand=${item?.brand?.id}`
                                                            : item?.type === "Offer"
                                                                ? `/campaign/${item?.offers?.id}`
                                                                : item?.type === "SubCategory"
                                                                    ? `/product-filter/sub-category/${item?.sub_category?.id}`
                                                                    : item?.type === "ChildCategory"
                                                                        ? `/product-filter/child-category/${item?.child_category?.id}`
                                                                        : "#"
                                                }
                                            >
                                                <ImageURL className={"h-full w-full object-fill"} image={item?.image} />
                                            </Link>
                                        ))}
                                    </CardCarousel>
                                </div>
                            </div>
                        )}
                        {item?.id == 6 && item?.section_data?.length > 0 && (
                            <div className="mb-4 md:mb-10  container mx-auto">
                                <h4 className="text-black px-[10px] font-inter text-[20px] font-semibold leading-normal mb-2 md:mb-4">{item.title}</h4>
                                <SwiperSlider>
                                    {item?.section_data?.map((item, i) => (
                                        <SwiperSlide key={item?.id}>
                                            <CenterAlignCard item={item} />
                                        </SwiperSlide>
                                    ))}
                                </SwiperSlider>
                            </div>
                        )}
                        {item?.id == 7 && item?.section_data?.length > 0 && (
                            <div className="mb-4 md:mb-10  container mx-auto">
                                <h4 className="text-black px-[10px] font-inter text-[20px] font-semibold leading-normal mb-2 md:mb-4">{item.title} </h4>
                                <SwiperSlider>
                                    {item?.section_data?.map((item, i) => (
                                        <SwiperSlide key={item?.id}>
                                            <BrandCard item={item} />
                                        </SwiperSlide>
                                    ))}
                                </SwiperSlider>
                            </div>
                        )}
                        {item?.id == 8 && item?.section_data?.length > 0 && (
                            <div className="mb-4 md:mb-10  px-[10px] container mx-auto">
                                <h4 className="text-black font-inter text-[20px] font-semibold leading-normal mb-2 md:mb-4">{item.title}</h4>
                                <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-x-5 gap-y-3">
                                    {item?.section_data?.map((item, i) => (
                                        <div key={i} className="min-w-min">
                                            <BrandCard item={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {item?.id == 12 && item?.section_data?.length > 0 && (
                            <div className="mb-4 md:mb-10  px-[10px] container mx-auto">
                                <h4 className="text-black font-inter text-[20px] font-semibold leading-normal mb-2 md:mb-4">{item.title}</h4>
                                {item?.banner && (
                                    <div className="mb-4 md:mb-10 h-[100px] lg:h-[250px] overflow-hidden flex items-center justify-center relative">
                                        <ImageURL className={" h-auto w-auto max-w-full max-h-full object-fill"} image={item?.banner} />
                                    </div>
                                )}
                                <div className="mb-4 md:mb-10  container mx-auto">
                                    <CardCarousel
                                        type="egg"
                                        defaultSlidesToShow={item?.section_data?.length >= 6 ? 6 : item?.section_data?.length}
                                        slidesToShowFor540={item?.section_data?.length >= 1 ? 1 : item?.section_data?.length}
                                        slidesToShowFor640={item?.section_data?.length >= 2 ? 2 : item?.section_data?.length}
                                        slidesToShowFor768={item?.section_data?.length >= 2 ? 2 : item?.section_data?.length}
                                        slidesToShowFor1024={item?.section_data?.length >= 3 ? 3 : item?.section_data?.length}
                                        slidesToShowFor1280={item?.section_data?.length >= 4 ? 4 : item?.section_data?.length}
                                        slidesToShowFor1536={item?.section_data?.length >= 5 ? 5 : item?.section_data?.length}
                                    >
                                        {item?.section_data?.map((item, i) => (
                                            <div key={i} className="min-w-min md:px-[10px] md:pb-3">
                                                <EggCard item={item} />
                                            </div>
                                        ))}
                                    </CardCarousel>
                                </div>
                            </div>
                        )}
                        {item?.id == 5 && item?.section_data?.length > 0 && (
                            <div className="mb-4 md:mb-10  px-[10px] container mx-auto">
                                <h4 className="text-black font-inter text-[20px] font-semibold leading-normal mb-2 md:mb-4">{item.title} </h4>
                                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2 gap-x-5 gap-y-3">
                                    {item?.section_data?.slice(0, 2).map((item, i) => (
                                        <div key={i} className="min-w-min">
                                            <BrandCard item={item} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {item?.id == 15 && item?.section_data?.length > 0 && (
                            <div className="mb-4 md:mb-10 container mx-auto">
                                <h4 className="text-black px-[10px] font-inter text-[20px] font-semibold leading-normal mb-2 md:mb-4">{item.title}</h4>
                                <SwiperSlider>
                                    {item?.section_data?.map((item, i) => (
                                        <SwiperSlide key={item?.id}>
                                            <CenterAlignCard item={item} />
                                        </SwiperSlide>
                                    ))}
                                </SwiperSlider>
                            </div>
                        )}
                        {item?.id == 18 && item?.section_data?.length > 0 && (
                            <div className="px-[10px] mb-4 md:mb-10  container mx-auto">
                                <SlimSlider dots={false} item={item?.section_data} isLinkClickOffer={true} />
                            </div>
                        )}
                    </Fragment>
                ))
            ) : (
                <div className="my-container md:pt-5">
                    <div className="flex flex-col justify-center items-center min-h-[50vh] px-4">
                        <div className="text-center max-w-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                                Welcome to Perfecto
                            </h2>
                            <p className="text-gray-600 mb-6">
                                We're having trouble loading the homepage content right now.
                                You can still browse our products and shop!
                            </p>
                            <div className="space-y-3">
                                <Link
                                    to="/product-filter"
                                    className="block w-full bg-[#5DC9F4] text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                                >
                                    Browse Products
                                </Link>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="block w-full bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                                >
                                    Try Again
                                </button>
                                <Link
                                    to="/diagnostics"
                                    className="block w-full bg-orange-500 text-white py-2 px-4 rounded text-sm hover:bg-orange-600 transition-colors"
                                >
                                    Run Diagnostics
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ScrollRestoration />

            {/* ---------------- */}
            {/*
            <div className="grid grid-cols-3 gap-x-5 gap-y-4">
                {numbers.slice(0, 3).map((Num, i) => (
                    <DiscountCardForSlider key={i} image={DiscountCardForSliderImage} />
                ))}
            </div>
            <div className="grid grid-cols-3 gap-x-5 gap-y-4">
                {numbers.slice(0, 3).map((Num, i) => (
                    <BrandCard key={i} image={img1} />
                ))}
            </div>
            <div className="grid grid-cols-4 gap-x-5 gap-y-4">
                {numbers.slice(0, 4).map((Num, i) => (
                    <BrandCard key={i} image={img2} />
                ))}
            </div>
            <div className="grid grid-cols-5 gap-x-5 gap-y-4">
                {numbers.slice(0, 5).map((Num, i) => (
                    <BrandCard key={i} image={img3} />
                ))}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-x-5 gap-y-4">
                {numbers.slice(0, 5).map((Num, i) => (
                    <LeftAlignCard key={i} img={img4} />
                ))}
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-4">
                {numbers.slice(0, 5).map((Num, i) => (
                    <CenterAlignCard key={i} img={centerAlignCardImg} />
                ))}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-x-5 gap-y-4">
                {numbers.slice(0, 6).map((Num, i) => (
                    <EggCard key={i} image={eggCardImage} eggCardProductImage={eggCardProductImage} />
                ))}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-x-5 gap-y-4">
                {numbers.slice(0, 5).map((Num, i) => (
                    <CategoryCard key={i} />
                ))}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-x-5 gap-y-4">
                {numbers.slice(0, 5).map((Num, i) => (
                    <CarouselCategoryCard key={i} />
                ))}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-x-5 gap-y-4">
                {numbers.slice(0, 5).map((Num, i) => (
                    <DiscountCard key={i} />
                ))}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-x-5 gap-y-4">
                {numbers.slice(0, 5).map((Num, i) => (
                    <SaveCard key={i} />
                ))}
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-x-5 gap-y-4">
                {numbers.slice(0, 5).map((Num, i) => (
                    <IngredientCard key={i} img={centerAlignCardImg} />
                ))}
            </div> */}
            {/* <PrimaryButton title={"Shop All Makeup"} icon={<AiOutlineRight />} /> */}

            {/* <DeliveryAndReturnBanner  /> */}
        </div>
    );
};

export default Home;
