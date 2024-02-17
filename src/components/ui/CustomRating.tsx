import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { ComponentProps, forwardRef } from "react";
type CustomRatingProps = {
  color?: "gold" | "basic";
} & ComponentProps<typeof Rating>;

const CustomRating = forwardRef<HTMLDivElement, CustomRatingProps>(
  ({ color = "basic", ...otherProps }, ref) => {
    const themeAdjustedFillColor: string =
      color === "basic" ? "rgb(113 113 122)" : "rgb(250 204 21)";
    return (
      <Rating
        ref={ref}
        itemStyles={{
          itemShapes: ThinRoundedStar,
          activeFillColor: themeAdjustedFillColor,
          inactiveFillColor: "rgb(113 113 122 / 30%)",
        }}
        {...otherProps}
      />
    );
  },
);

CustomRating.displayName = "CustomRating";

export default CustomRating;
