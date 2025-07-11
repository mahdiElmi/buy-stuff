import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Blog | Buy Stuff",
    default: "Blog",
  },
};

async function layout({ children }: { children: React.ReactNode }) {
  return children;
}
export default layout;
