import { coupon } from "./couponsRendedPage";
import CouponBox from "./couponBox";
import { UserPropsReturn } from "../../user/context/userContext";

interface props{
    coupons: coupon[];
    getAvalibleCoupons: () => Promise<void>
    currUser: UserPropsReturn | undefined
}

export default function RenderAvalibleCoupons({coupons, getAvalibleCoupons, currUser} : props){
    return(
        <div className="flex flex-col">
            {coupons.map((coupon) => (
                <CouponBox
                    key={coupon.id}
                    coupon={coupon}
                    getAvalibleCoupons={getAvalibleCoupons}
                    currUser={currUser}
                />
            ))}
        </div>
    )
}