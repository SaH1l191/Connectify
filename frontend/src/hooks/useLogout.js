import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { useToast } from '@chakra-ui/react'
  import { SmallCloseIcon } from '@chakra-ui/icons'
  import { useRef, useState } from 'react'
  import usePreviewImg from '../hooks/usePreviewImg'
const useLogout = () => {
    const [user, setUser] = useRecoilState(userAtom);
    const showToast = useToast();
    const navigate = useNavigate()

    const logout = async () => {
        try {
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (data.error) {
                showToast({ title: "Error", description: data.message, status: "error" });
                return;
            }
            localStorage.removeItem('user-threads');
            setUser(null);
            showToast({ title: "Success", description: "Logged out successfully", status: "success" });
            navigate("/auth")
        } catch (error) {
            showToast({ title: "Error", description: error.message, status: "error" });
        }
    };

    return logout;
};

export default useLogout;
