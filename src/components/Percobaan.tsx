import { Card, CardContent, CardMedia, Skeleton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import NavbarComponent from "../components/NavbarComponent";
import SearchComponent from "../components/SearchComponent";
import {
  setDataCurrentPage,
  setDataNextPage,
  setLoading,
} from "../features/data/homeSlice";
import { setDataSearch } from "../features/search/searchSlice";
import { API_URL } from "../utils/api";

const useStyles = makeStyles({
  header: {
    display: "flex",
    height: "70px",
    width: "700px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  iconHeader: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  judulHeader: {
    display: "inline-block",
    alignSelf: "flex-end",
    fontSize: "20px",
    fontWeight: "bold",
    marginLeft: "20px",
    paddingBottom: "10px",
  },
  container: {
    backgroundColor: "rgb(247, 247, 247)",
    paddingBottom: "40px",
  },
  box: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    width: "750px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  item: {
    marginTop: "30px",
    marginLeft: "20px",
    marginRight: "20px",
  },
  imageHotPromo: {
    width: "30px",
  },
  imageBrand: {
    height: "25px",
    marginBottom: "15px",
    marginLeft: "5px",
  },
  imageJenis: {
    height: "150px",
    marginTop: "-10px",
  },
  imageWaktuBerakhir: {
    height: "12px",
  },
  cardHeader: {
    fontSize: "10px",
    fontWeight: "bold",
    marginTop: "-15px",
    marginBottom: "10px",
    marginLeft: "-3px",
  },
  cardContent: {
    fontSize: "12px",
    marginLeft: "-3px",
  },
  waktuBerakhir: {
    fontSize: "8px",
    fontWeight: "bold",
    marginTop: "-10px",
    marginLeft: "5px",
  },
});

type List = {
  id: number;
  brand: string;
  imageBrand: string;
  jenis: string;
  subjenis: string;
  imageJenis: string;
  waktuBerakhir: string;
};

function Percobaan() {
  // Styling MUI
  const classes = useStyles();

  // React Redux, membuat data menjadi dynamic
  const dispatch = useAppDispatch();
  // searchSlice
  const dataSearch = useAppSelector((state) => state.search.dataSearch);
  // homeSlice
  const dataCurrentPage = useAppSelector((state) => state.home.dataCurrentPage);
  const dataNextPage = useAppSelector((state) => state.home.dataNextPage);
  const loading = useAppSelector((state) => state.home.loading);
  console.log("Rendering... dataCurrentPage : ", dataCurrentPage);
  console.log("Rendering... dataNextPage : ", dataNextPage);
  console.log("Rendering... loading : ", loading);

  let dataStartRequest = 0;
  let dataLengthRequest = 8;
  const [bottom, setBottom] = useState<boolean>(false);

  // Untuk tampilan sementara
  const [dataBefore, setDataBefore] = useState<List[] | Array<any>>();

  // Ini hanya dipakai ketika mounting saja
  // Mounting 8 list
  const getPromoList = () => {
    axios
      .get(
        API_URL +
          "listPromos?_start=" +
          dataStartRequest +
          "&_limit=" +
          dataLengthRequest
      )
      .then((res) => {
        dispatch(setDataCurrentPage(res.data));
      })
      .catch((error) => {
        console.log(error);
      });
    dataStartRequest += dataLengthRequest;
  };

  // Store data dari next page ketika yang nantinya akan discrolling
  const getNextPage = () => {
    axios
      .get(
        API_URL +
          "listPromos?_start=" +
          dataStartRequest +
          "&_limit=" +
          dataLengthRequest
      )
      .then((res) => {
        dispatch(setDataNextPage(res.data));
      })
      .catch((error) => {
        console.log(error);
      });
    dataStartRequest += dataLengthRequest;
  };

  const handleScroll = (event: any) => {
    console.log("loading : ", loading);
    if (loading) {
      // Jika sudah mencapai bottom page
      if (
        window.innerHeight + event.target.documentElement.scrollTop + 1 >
        event.target.documentElement.offsetHeight
      ) {
        // Jika masih ada page selanjutnya dan tidak loading
        if (dataNextPage.length > 0 && !loading) {
          // Untuk keperluan loading skeleton data selanjutnya
          dispatch(setLoading(true));
          setDataBefore(dataCurrentPage); // Data before
          console.log("setDataBefore : ", dataCurrentPage);
          dispatch(setDataCurrentPage(dataNextPage));
          // Memanggil halaman selanjutnya
          // getNextPage();
        }
        console.log("BOTTOM PAGE");
        // setBottom(true);
      }
    }
  };

  // ComponentDidMount
  useLayoutEffect(
    () => {
      dispatch(setDataSearch([])); //Reset data dari search

      getPromoList(); // Page sekarang
      getNextPage(); // Page selanjutnya
      
      console.log("ComponentDidMount");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // ComponentDidMount and ComponentDidUpdate Set Time Out untuk Skeleton
  // useEffect tidak berpengaruh kepada selain dari return
  useEffect(() => {
    // Jika si loading berubah menjadi true, maka akan set menjadi false dalam kurun waktu 2 detik
    setTimeout(() => dispatch(setLoading(false)), 2000);
    console.log("scroll scroll scroll");
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // ComponentDidMount and ComponentDidUpdate Set Time Out untuk Skeleton
  // useEffect tidak berpengaruh kepada selain dari return
  useEffect(() => {
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bottom]);

  return (
    <div>
      <NavbarComponent />
      {dataSearch.length > 0 ? (
        <SearchComponent />
      ) : (
        <div>
          {/* Header */}
          <div>
            <Box className={classes.header}>
              <div className={classes.iconHeader}>
                <img
                  src={"assets/images/hotpromo.png"}
                  className={classes.imageHotPromo}
                  alt="Hot Promo"
                ></img>
              </div>
              <div className={classes.judulHeader}>Promo Terbaik Hari Ini</div>
            </Box>
          </div>
          {/* Body */}
          <div className={classes.container}>
            {/* If statement untuk skeleton */}
            {!loading && dataCurrentPage ? (
              // Jika tidak loading dan ada listnya
              <Box className={classes.box}>
                {dataCurrentPage.map((promo) => {
                  return (
                    <div className={classes.item} key={promo.id}>
                      {/* Image Brand */}
                      <img
                        src={"assets/images/brand/" + promo.imageBrand}
                        className={classes.imageBrand}
                        alt={promo.brand}
                      ></img>
                      {/* Card */}
                      <Card
                        sx={{
                          borderRadius: "10px",
                          boxShadow: "1px 1px 2px 2px rgb(0 0 0 / 10%)",
                        }}
                      >
                        <CardContent>
                          <div className={classes.cardHeader}>Hot Promo</div>
                          <div className={classes.cardContent}>
                            {promo.jenis}
                          </div>
                          <div className={classes.cardContent}>
                            <strong>{promo.subjenis}</strong>
                          </div>
                        </CardContent>
                        <CardMedia
                          component="img"
                          image={"assets/images/" + promo.imageJenis}
                          className={classes.imageJenis}
                          alt={"assets/images/" + promo.imageJenis}
                        />
                      </Card>
                      {/* Timer Discount */}
                      <div>
                        <Box component="div" sx={{ display: "inline" }}>
                          <img
                            src="assets/images/hours_glass.png"
                            className={classes.imageWaktuBerakhir}
                            alt="Waktu Berakhir"
                          ></img>
                        </Box>
                        <Box
                          className={classes.waktuBerakhir}
                          component="div"
                          sx={{ display: "inline" }}
                        >
                          {promo.waktuBerakhir}
                        </Box>
                      </div>
                    </div>
                  );
                })}
              </Box>
            ) : (
              // Jika loading atau belum ada listnya
              <Box className={classes.box}>
                {dataBefore?.map((promo) => {
                  return (
                    <div className={classes.item} key={promo.id}>
                      {/* Image Brand */}
                      <img
                        src={"assets/images/brand/" + promo.imageBrand}
                        className={classes.imageBrand}
                        alt={promo.brand}
                      ></img>
                      {/* Card */}
                      <Card
                        sx={{
                          borderRadius: "10px",
                          boxShadow: "1px 1px 2px 2px rgb(0 0 0 / 10%)",
                        }}
                      >
                        <CardContent>
                          <div className={classes.cardHeader}>Hot Promo</div>
                          <div className={classes.cardContent}>
                            {promo.jenis}
                          </div>
                          <div className={classes.cardContent}>
                            <strong>{promo.subjenis}</strong>
                          </div>
                        </CardContent>
                        <CardMedia
                          component="img"
                          image={"assets/images/" + promo.imageJenis}
                          className={classes.imageJenis}
                          alt={"assets/images/" + promo.imageJenis}
                        />
                      </Card>
                      {/* Timer Discount */}
                      <div>
                        <Box component="div" sx={{ display: "inline" }}>
                          <img
                            src="assets/images/hours_glass.png"
                            className={classes.imageWaktuBerakhir}
                            alt="Waktu Berakhir"
                          ></img>
                        </Box>
                        <Box
                          className={classes.waktuBerakhir}
                          component="div"
                          sx={{ display: "inline" }}
                        >
                          {promo.waktuBerakhir}
                        </Box>
                      </div>
                    </div>
                  );
                })}
                {Array.from(Array(dataLengthRequest), (e, i) => {
                  // Skeleton
                  return (
                    <div className={classes.item} key={i}>
                      {/* Image Brand */}
                      <Skeleton
                        variant="rectangular"
                        sx={{
                          height: "25px",
                          width: "70%",
                          marginBottom: "18px",
                          marginLeft: "5px",
                          borderRadius: "20px",
                        }}
                      />
                      {/* Card */}
                      <Card
                        sx={{
                          borderRadius: "10px",
                          boxShadow: "1px 1px 2px 2px rgb(0 0 0 / 10%)",
                        }}
                      >
                        <CardContent>
                          <div className={classes.cardHeader}>
                            <Skeleton
                              variant="text"
                              sx={{ width: "50px", height: "12px" }}
                            />
                          </div>
                          <div className={classes.cardContent}>
                            <Skeleton
                              variant="text"
                              sx={{ width: "40px", height: "15px" }}
                            />
                          </div>
                          <div className={classes.cardContent}>
                            <Skeleton
                              variant="text"
                              sx={{ height: "15px", marginTop: "-2px" }}
                            />
                          </div>
                        </CardContent>
                        <Skeleton
                          variant="rectangular"
                          sx={{ height: "150px", marginTop: "-10px" }}
                        />
                      </Card>
                      {/* Timer Discount */}
                      <Skeleton
                        variant="rectangular"
                        sx={{
                          height: "12px",
                          width: "65%",
                          marginTop: "10px",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  );
                })}
              </Box>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Percobaan;
