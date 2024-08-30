import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5 " >
			<div className="bg-light container py-2 mb-5 border border-radius border-4 rounded-5">
				<div>
					<h1>This entire project is just an Frontend + Backend integration example</h1>
					<h4>You are currently in the Home View!</h4>
					<p className="">
						Try register or login button to change views!
					</p>
				</div>
			</div>
			<p>
				<img src="https://res.cloudinary.com/dmkw4vacw/image/upload/v1725023572/frontend-vs-bancend_gdo5ub.webp" style={{ height: "500px" }} />
			</p>
			<div className="alert alert-info">
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>


		</div>
	);
};