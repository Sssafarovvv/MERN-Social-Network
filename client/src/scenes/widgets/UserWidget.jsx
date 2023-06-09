import {
  ManageAccountsOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme, Button } from "@mui/material";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomModalWidget from "./CustomModalWidget";
import VK from "./vk.svg"
import {setIsLoading} from "../../state"
import Loader from "components/Loader";

const UserWidget = ({ userId, picturePath, isProfile }) => {
  const handleModalClose = () => {
    setModal(false);
  };
  const [modal, setModal] = useState(false)
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const URL = useSelector((state) => state.URL)
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.isLoading)

  const getUser = async () => {
    dispatch(setIsLoading({isLoading: true}))
    const response = await fetch(`${URL}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
    dispatch(setIsLoading({isLoading: false}))
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <Loader />;
  }

  console.log(isLoading)


  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
    vk,
  } = user;

console.log(vk, firstName)

  return  (
  <WidgetWrapper>
    {/* FIRST ROW */}
    <FlexBetween
      gap="0.5rem"
      pb="1.1rem"
    >
      <FlexBetween gap="1rem"  onClick={() => navigate(`/profile/${userId}`)}>
        <UserImage image={picturePath} />
        <Box>
          <Typography
            variant="h4"
            color={dark}
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {firstName} {lastName}
          </Typography>
          <Typography color={medium}>{friends.length} friends</Typography>
        </Box>
      </FlexBetween>
      {modal === true ? (
        <>
        {isProfile ? <></> : <><CustomModalWidget open={modal} onClose={handleModalClose} initialValues={{ firstName, lastName, location }} token={token} userId={userId} image={picturePath} />
        <Button>
        <ManageAccountsOutlined />
        </Button>
        </>
}
        </>
      ) : (
        <Button onClick={() => setModal(true)}>
          <ManageAccountsOutlined />
        </Button>
      )}
    </FlexBetween>

    <Divider />

    {/* SECOND ROW */}
    <Box p="1rem 0">
      <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
        <LocationOnOutlined fontSize="large" sx={{ color: main }} />
        <Typography color={medium}>{location}</Typography>
      </Box>
      <Box display="flex" alignItems="center" gap="1rem">
        <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
        <Typography color={medium}>{occupation}</Typography>
      </Box>
    </Box>

    <Divider />

    {/* THIRD ROW */}
    <Box p="1rem 0">
      <FlexBetween mb="0.5rem">
        <Typography color={medium}>
          Сколько раз просматривали ваш профиль
        </Typography>
        <Typography color={main} fontWeight="500">
          {viewedProfile}
        </Typography>
      </FlexBetween>
      <FlexBetween>
        <Typography color={medium}>Количество оценок</Typography>
        <Typography color={main} fontWeight="500">
          {impressions}
        </Typography>
      </FlexBetween>
    </Box>

    <Divider />

    {/* FOURTH ROW */}
    {!vk ? <></> : (<Box p="1rem 0">
      <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
        Социальный профиль
      </Typography>

      <FlexBetween gap="1rem" mb="0.5rem">
        <FlexBetween gap="1rem">
        <a href={vk} target="_blank" rel="noreferrer">
          <img src={VK} alt="vk" />
          </a>
          <Box>
            <Typography color={main} fontWeight="500">
              VK
            </Typography>
            <Typography color={medium}>Социальная сеть</Typography>
          </Box>
        </FlexBetween>
      </FlexBetween>

    </Box>)}
  </WidgetWrapper>)
};

export default UserWidget;
