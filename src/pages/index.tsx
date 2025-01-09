import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import { ITaskApiResponse } from "@/types";
const TaskManager = dynamic(() => import("@/components/TaskManager"), { 
  ssr: false 
});

export default function Home({ data }: { data: ITaskApiResponse }) {
  return (
    <div className="flex min-w-full items-center justify-center h-screen">
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
