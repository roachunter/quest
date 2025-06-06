import "./styles/NavBar.css";

const NavBar = () => {
  return (
    <nav>
      <button>
        <img src="../../assets/arrow.svg" alt="arrow-left" />
      </button>
      <h1>QUESTS</h1>
      <button>
        <img
          className="flip-horizontally"
          src="../../assets/arrow.svg"
          alt="arrow-right"
        />
      </button>
    </nav>
  );
};
export default NavBar;
