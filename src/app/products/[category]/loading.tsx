import Loading from "../loading";

const CategoryLoading = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-md my-8" />
      <Loading />
    </div>
  );
};

export default CategoryLoading;
