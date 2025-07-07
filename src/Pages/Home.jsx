import React from "react";
import HomeDataContext from "../Hooks/HomeDataContext";
import HomeRightSideComponent from "../components/HomeRightSideComponent";
import Menu from "../components/Menu";
import Todos from "../components/Todos";

/* siggle and multiselect
Single Select Options
//TODO: Copy , Share , Print(PDF) , Pinnded
Multiple Select Options
//TODO: Copy ,Delete , Complete, Pinnded  
*/
const Home = () => {
  return (
    <React.Fragment>
      <HomeDataContext>
        <main className="flex w-[80vw] h-screen bg-[#28282B]">
          <section className="flex-col w-[60vw] h-full">
            <Menu />
            <Todos />
          </section>
          <section className="bg-blue">
            {/*TODO: Filter = All,Incomplete,completed*/}
            {/*TODO: Category = Uncategory,Birthday,Coding */}
            {/*TODO: In Todo list options completed,edit,delete*/}
            <HomeRightSideComponent />
          </section>
        </main>
      </HomeDataContext>
    </React.Fragment>
  );
};

export default Home;
