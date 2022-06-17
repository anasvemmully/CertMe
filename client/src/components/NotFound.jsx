import { Link } from "react-router-dom";
import useAuth from "../context/useAuth";
import Image404 from "../images/404.gif";

const NotFound = () => {
  console.log(window.location.origin);

  const { auth } = useAuth();

  return (
    <section className="flex justify-center items-center h-screen w-screen">
      <div className="flex flex-col items-center">
        <div className="absolute flex items-center gap-4">
          <span className="text-8xl sm:text-9xl">404</span>
          <div className="font-bold text-lg sm:text-3xl">
            <div>PAGE</div>
            <div>NOT</div>
            <div>FOUND</div>
          </div>
        </div>
        <img src={Image404} alt="404" />
        <div className="absolute inline bottom-1/4 border-dotted border-2 border-slate-400 rounded-full py-1 px-2 font-semibold">
          {auth ? (
            <Link to="/dashboard">Go to Dashboard</Link>
          ) : (
            <a href={`${window.location.origin}`}>Go to Home</a>
          )}
        </div>
      </div>
    </section>
  );
};

export default NotFound;
