import { GetServerSideProps } from "next";
import TaskManager from "@/components/TaskManager";
import { ITaskApiResponse } from "@/types";

export default function Home({ data }: { data: ITaskApiResponse }) {
  return (
    <div className="flex min-w-full items-center justify-center">
      <TaskManager data={data} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`
    );
    const data = await response.json();
    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error("error in fetching tasks:", error);
    return {
      props: {
        data: {
          tasks: [],
          pagination: {
            total: 0,
            has_next: false,
            page_size: 0,
            offset: 0,
          },
        },
      },
    };
  }
};
