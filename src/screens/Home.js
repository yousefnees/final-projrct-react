import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect, useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import Input from "../components/Input";
import LatoText from "../components/LatoText";
import fontPixel from "../services/fontPixel";
import { font, sHeight, wp } from "../services/helper";
import actions from "../store/actions";
import colors from "../theme/colors";


function Home({ navigation, ...props }) {

    const dispatch = useDispatch()
    const isMovie = useSelector(state => state.movie)
    const [inputs, setInputs] = useState({ title: '', loading: false, filteredData: null, isMovie: true, isTV: false })

    const onInputChange = (val, field) => {
        setInputs({ ...inputs, [field]: val })
    }

    const [page, setPage] = useState(1)
    const searchHandler = async () => {
        const url = isMovie ? `https://api.themoviedb.org/3/search/movie?query=${inputs.title}&include_adult=false&language=en-US&page=${page}` :
            `https://api.themoviedb.org/3/search/tv?query=${inputs.title}&include_adult=false&language=en-US&page=${page}`
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlYjBjMjgzOGRiODdiMGZlNjZjNDY5YWZlYTgwN2VhOCIsInN1YiI6IjY0YWQ0NDVjNjZhMGQzMDEzYTc0MzZjMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Fwg70NL3YG390_R-Dw6QDdVBgTpuUeFaCRu8rBfiaE8'
            }
        };

        await fetch(`${url}`, options)
            .then(response => response.json())
            .then(response => {
                // console.log(response)
                // onInputChange('filteredData', response?.results)
                setInputs({ ...inputs, filteredData: response?.results })
            })
            .catch(err => console.error(err));
        setShowInput(false);
    }

    const btnsHandler = (btn) => {
        switch (btn) {
            case 'movie': {
                setInputs({ ...inputs, isMovie: true, isTV: false, filteredData: null })
                dispatch(actions.setMovie(true))
                break;
            } case 'tv': {
                setInputs({ ...inputs, isMovie: false, isTV: true, filteredData: null })
                dispatch(actions.setMovie(false))
                break;
            }
        }
    }

    const [showInput, setShowInput] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchButtonPress = () => {
        setShowInput(true);
    };
    const handleInputChange = (text) => {
        setSearchQuery(text);
        // Perform your search logic here, such as updating search results.
    };

    const handleInputBlur = () => {
        setShowInput(false);
        setSearchQuery('');
    };
    const handleInputSubmit = () => {
        // Perform your search logic here, using the searchQuery state.
        setShowInput(false);
        setSearchQuery('');
    };
    
    const favoritesNavHandler = async () => {
        navigation.navigate('Favorites')
    }
    return (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: sHeight + 5, paddingHorizontal: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <FontAwesome style={{ marginRight: 10, }} onPress={() => navigation.goBack()} name='angle-left' size={fontPixel(40)} color='#000' />
                    <Button onPress={() => btnsHandler('movie')} text={'Movies'} width={wp(25)} height={wp(8)} marginHorizontal={3} backgroundColor={isMovie ? '#000' : 'gray'} />
                    <Button onPress={() => btnsHandler('tv')} text={'TV Series'} width={wp(25)} height={wp(8)} backgroundColor={!isMovie ? '#000' : 'gray'} />
                </View>
                <Button onPress={favoritesNavHandler} text={'Favorites'} width={wp(30)} height={wp(10)} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, alignItems: 'center', }}>
                {showInput ? <Input width={'85%'} height={wp(12)}
                    value={inputs.title}
                    onChangeText={val => setInputs({ ...inputs, title: val })}
                    onSubmitPressed={searchHandler}
                    placeholder={'Search'}
                /> :
                    <FontAwesome onPress={() => handleSearchButtonPress()} style={{ transform: [{ rotateY: '180deg' }] }} name='search' size={fontPixel(34)} color='#000' />}
            </View>
            <View style={{ flex: 1, marginTop: 18,marginBottom: 30, borderWidth: 2, borderColor: '#D8D8D8', paddingHorizontal: 18 }}>
                <FlatList
                    data={inputs?.filteredData}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item, index }) =>
                        <TouchableOpacity key={index} onPress={() => navigation.navigate("MovieDetails", item)}
                            style={{ flex: 1, padding: 12, borderBottomWidth: 0.5, borderColor: '#000', backgroundColor: 'transparent' }}>
                            <LatoText text={isMovie ? item?.title : item?.name} fontSize={fontPixel(18)} color={'#000'} />
                        </TouchableOpacity>
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#fff",
        paddingBottom: 40,
        justifyContent: "center",
        alignItems: 'center',
        paddingHorizontal: 10
    },
});
const mapDispatchToProps = (dispatch) => {
    return {
        _logout: () => dispatch(actions.logoutUser())
    }
}
export default connect(null, mapDispatchToProps)(Home);
