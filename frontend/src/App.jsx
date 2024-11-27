import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import HomePage from "./pages/HomePage";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import userAtom from "./atoms/userAtom";
import CreatePost from "./components/CreatePost";
import SettingsPage from "./pages/SettingsPage";
import ChatPage from "./pages/ChatPage";

function App() {

	const user = useRecoilValue(userAtom)
	console.log(user)

	const { pathname } = useLocation();

	return (
		<Box position={"relative"} w="full" >
			<Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
				<Header />
				<Routes>
					<Route path='/' element={user ? <HomePage /> : <Navigate to={"/auth"} />} />
					<Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} /> 
					<Route path="/:username" element={user ? <> <UserPage /> <CreatePost />  </> : <UserPage />} />
					<Route path='/:username/post/:pid' element={<PostPage />} />
					<Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />
					<Route path='/chat' element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
					<Route path='/settings' element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />

				</Routes>

			</Container>
		</Box>
	);
}

export default App;
