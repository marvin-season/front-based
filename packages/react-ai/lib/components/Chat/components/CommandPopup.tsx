import { FC, ReactNode } from "react";

const CommandPopup: FC<{
  children?: ReactNode;
}> = ({children}) => {
  return <>
    <div className={"rounded border p-2 bg-gray-300"}>
      {children}
    </div>
  </>;
};

export default CommandPopup;
