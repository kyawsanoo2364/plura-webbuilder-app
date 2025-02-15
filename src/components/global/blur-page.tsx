import React from "react";

type Props = {
  children: React.ReactNode;
};
const BlurPage = ({ children }: Props) => {
  return (
    <div
      className="h-screen overflow-scroll backdrop-blur-[35px] dark:bg-muted/40 bg-muted/60 dark:shadow-2xl dark:shadow-black z-[11] mx-auto pt-24 p-4 absolute top-0 left-0 bottom-0 right-0"
      id="blur-page"
    >
      {children}
    </div>
  );
};
export default BlurPage;
