import ProductsPage from "./pages/products-page";

interface generateMetadataProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const generateMetadata = async ({
  searchParams,
}: generateMetadataProps) => {
  const { mine } = await searchParams;

  return {
    title: mine === "true" ? "My Products" : "Products",
  };
};

const Page = () => {
  return (
    <>
      <ProductsPage />
    </>
  );
};

export default Page;
