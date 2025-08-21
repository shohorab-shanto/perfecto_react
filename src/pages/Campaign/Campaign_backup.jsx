import React, {useEffect, useState} from "react";
import {Bars} from "react-loader-spinner";
import {ScrollRestoration, useLocation, useParams} from "react-router-dom";
import CardCarousel from "../../components/CardCarousel/CardCarousel";
import ImageURL from "../../components/ImageURL/ImageURL";
import CarouselCategoryCard from "../../components/allCards/CarouselCategoryCard/CarouselCategoryCard";
import CenterAlignCard from "../../components/allCards/CenterAlignCard/CenterAlignCard";
import ComboCard from "../../components/allCards/ComboCard/ComboCard";
import {useOfferProductsMutation} from "../../redux/features/offers/offersApi";
import ProductFilterPage from "../ProductFilterPage/ProductFilterPage";
import useCartData from "../../hooks/useCartData";
import HomeSkeleton from "../Home/HomeSkeleton/HomeSkeleton";
import CampaignGridView from "./CampaignGridView/CampaignGridView";
import SwiperSlider from "../../components/SwiperSlider/SwiperSlider";
import {SwiperSlide} from "swiper/react";
import CenterAlignCardFilter from "../../components/allCards/CenterAlignCard/CenterAlignCardFilter.jsx";

const Campaign = () => {
    const [isCategoryFilter, setIsCategoryFilter] = useState(false);
    const [offerProductsMutation, {data: offerProductListData, isLoading: offerProductListLoading}] = useOfferProductsMutation();
    const location = useLocation();
    const {id, campaignCategoryId} = useParams();
    const {cartData, cartIsLoading} = useCartData();

    const generateNewArray = () => {
        return offerProductListData?.data?.data.map((offerProduct) => {
            const isAlreadyAdded = cartData?.data.some((cartItem) => cartItem.id === offerProduct.product_id);
            return {
                ...offerProduct,
                alreadyAdded: isAlreadyAdded,
            };
        });
    };

    //

    useEffect(() => {
        const fetchOfferListData = async () => {
            const offerBodyData = {
                offer_id: id,
                pagination: 70,
            };

            try {
                const response = await offerProductsMutation(offerBodyData);
                //
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };
        fetchOfferListData();
    }, [id]);

    if (offerProductListLoading) {
        return (
            <HomeSkeleton/>
        );
    }

    return (
        <>
            <SwiperSlider/>
            {offerProductListData?.status == true &&
                (offerProductListData?.data?.offerInfoData?.offer_type_id == 1 ? (
                    <div>
                        <div className="my-3 container mx-auto px-[10px] mb-8">
                            <ImageURL className={" w-full object-fill h-[120px] md:h-[220px]"} image={offerProductListData?.data?.offerInfoData?.banner_web}/>
                        </div>

                        <div className="my-3 container mx-auto px-[10px] mb-10">
                            {offerProductListData?.data?.products.data?.length > 0 ? (
                                <div
                                    className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-2 md:gap-5 min-h-[calc(100vh-90vh)]">
                                    {offerProductListData?.data?.products.data?.map((item, i) => (
                                        <CenterAlignCardFilter key={i} item={item}/>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center flex justify-center items-center text-red-400 text-xl">No product found</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div>
                        No Data Found
                    </div>
                ))}
        </>
    );
};

export default Campaign;
