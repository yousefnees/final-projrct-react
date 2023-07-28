import { useEffect, useState } from "react";
import { Alert, FlatList, Image, Linking, ScrollView, StyleSheet, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect, useSelector } from "react-redux";
import AppLoader from "../components/AppLoader";
import LatoText from "../components/LatoText";
import fontPixel from "../services/fontPixel";
import { font, sHeight, wp } from "../services/helper";
import actions from "../store/actions";
import { addVideosMethod, getVideosByUserIdMethod } from "../api/api";
import colors from "../theme/colors";
import Button from "../components/Button";


function MovieDetails({ navigation, ...props }) {

    const user = useSelector(state => state.user)
    const isMovie = useSelector(state => state.movie)

    const [loading, setLoading] = useState(false)
    const [item, setItem] = useState()
    const [videos, setVideos] = useState([])
    

    useEffect(() => {
        getVideos()
        searchMovie()
    }, [])

    
    const searchMovie = async () => {
        let url = isMovie ? `https://api.themoviedb.org/3/movie/${props?.route?.params?.id}?language=en-US` :
            `https://api.themoviedb.org/3/tv/${props?.route?.params?.id}?language=en-US`
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjBjMjgzOGRiODdiMGZlNjZjNDY5YWZlYTgwN2VhOCIsInN1YiI6IjY0YWQ0NDVjNjZhMGQzMDEzYTc0MzZjMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Fwg70NL3YG390_R-Dw6QDdVBgTpuUeFaCRu8rBfiaE8'
            }
        };

        await fetch(url, options)
            .then(response => response.json())
            .then(response => {
                // console.log(response)
                setItem(response)
            })
            .catch(err => console.error(err));
    }

    // method to get favorite videos data from firebase database
    const getVideos = async () => {
        setLoading(true)
        let res = await getVideosByUserIdMethod()
        // console.log("videos", res?.data)
        if (res?.success) {
            if (res?.data.length) {
                setVideos(res?.data)
            }
        }
        else {
            alert(res?.message)
        }
        setLoading(false)
    }
    const [isVideoIncluded, setIsVideoIncluded] = useState(false);
    const isVideoInArray = videos.some((video) => video?.video?.id === item?.id);
    if (isVideoInArray && !isVideoIncluded) {
        setIsVideoIncluded(true);
    } else if (!isVideoInArray && isVideoIncluded) {
        setIsVideoIncluded(false);
    }


    // method to add selected movie/video to favorites list
    const addItemToDB = async () => {
        let type = isMovie ? 'Movie' : 'TVSeries'
        if (!isVideoIncluded) {
            let body = {
                type,
                video: item,
                createdAt: Date.now(),
                createdBy: user?.uid
            }
            // console.log(body)
            let res = await addVideosMethod(body)
            if (res?.success) {
                Alert.alert('Favorites', res?.message)
                getVideos()
            } else {
                Alert.alert('Favorites', res?.message)
            }
        } else {
            alert('added to favorites')
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: sHeight + 5, paddingHorizontal: 10, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <FontAwesome onPress={() => navigation.goBack()} name='angle-left' size={fontPixel(40)} color='#000' />
                <FontAwesome onPress={() => addItemToDB()} name={isVideoIncluded ? 'heart' : 'heart-o'} size={fontPixel(34)} color={'#000'} />
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 10 }}>
                <View style={{ flexDirection: 'row', }}>
                    <Image style={{ width: wp(40), height: wp(50), borderRadius: wp(2) }} source={{ uri: `https://image.tmdb.org/t/p/original/${item?.poster_path}` }} resizeMode="contain" />
                    <View style={{ marginLeft: 8, justifyContent: 'space-between', paddingBottom: 8 }}>
                        <View>
                            <LatoText width={wp(50)} text={isMovie ? item?.title : item?.name} fontName={font.PoppinsBold} />
                            <LatoText width={wp(50)} text={isMovie ? item?.release_date : item?.first_air_date} fontName={font.PoppinsSemiBold} fontSize={fontPixel(14)} marginTop={3} />
                            <LatoText width={wp(50)} text={isMovie ? `${item?.runtime} min` : `${item?.number_of_episodes} episodes`} fontName={font.PoppinsSemiBold} fontSize={fontPixel(14)} marginTop={3} />

                        </View>
                        <LatoText width={wp(50)} text={`${item?.vote_average.toFixed(1)}/10`} fontName={font.PoppinsSemiBold} fontSize={fontPixel(18)} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 14 }}>
                    {
                        item?.genres?.length > 0 &&
                        item?.genres?.map((item, index) => (
                            <View key={index} style={{ borderColor: '#000', borderWidth: 1, padding: 8, borderRadius: wp(20), margin: 3 }}>
                                <LatoText text={item?.name} fontSize={fontPixel(14)} />
                            </View>
                        ))
                    }
                </View>
                {item?.overview && <LatoText text={`Plot- ${item?.overview}`} fontSize={fontPixel(14)} marginTop={14} />}
            </ScrollView>
            <AppLoader loading={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#000",
        paddingBottom: 40,
        justifyContent: "center",
        alignItems: 'center',
        paddingHorizontal: 10
    },
});
export default connect(null, null)(MovieDetails);