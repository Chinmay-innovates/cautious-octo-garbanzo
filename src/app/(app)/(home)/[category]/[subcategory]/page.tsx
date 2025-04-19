interface Props {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}
const Page = async ({ params }: Props) => {
  const { subcategory, category } = await params;
  return (
    <div>
      category - {category} <br />
      Subcategory - {subcategory}
    </div>
  );
};

export default Page;
