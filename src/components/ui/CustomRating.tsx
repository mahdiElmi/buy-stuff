import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { ComponentProps } from "react";
type CustomRatingProps = {
  color?: "gold" | "basic";
} & ComponentProps<typeof Rating>;

function CustomRating({ color = "basic", ...otherProps }: CustomRatingProps) {
  const themeAdjustedFillColor: string =
    color === "basic" ? "rgb(113 113 122)" : "rgb(250 204 21)";
  return (
    <Rating
      itemStyles={{
        itemShapes: ThinRoundedStar,
        activeFillColor: themeAdjustedFillColor,
        inactiveFillColor: "rgb(113 113 122 / 30%)",
      }}
      {...otherProps}
    />
  );
}

export default CustomRating;
