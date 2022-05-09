import * as React from 'react';
import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Linking,
  Platform,
  AsyncStorage,
  Dimensions,
  Image,
  StatusBar,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwsome from 'react-native-vector-icons/FontAwesome';
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [
        {
          name: '',
          phone: '',
          show: true,
          select_favorite: false,
          img: require('./img/4.jpg'),
        },
      ],
      search_value: '',
      found: true,
      visible_add: false,
      new_name: '',
      new_phone: '',
      visible_detail: false,
      detailObj: {
        name: '',
        phone: '',
        show: true,
        select_favorite: false,
        img: require('./img/4.jpg'),
      },
      visible_updata: false,
      updata_name: '',
      updata_phone: '',
      updata_index: -1, // inital must be number and not exist
      selected: 1,
      value_data: '',
      favorite: [
        {
          name: '',
          phone: '',
          show: true,
          select_favorite: false,
          img: require('./img/4.jpg'),
        },
      ],
      recent: [
        {
          name: '',
          phone: '',
          show: true,
          select_favorite: false,
          img: require('./img/4.jpg'),
        },
      ],
      mobileNo: '',
      message: '',
      show_whatss: false,
    };
  }
  searchfun(seacrh_name) {
    let list = this.state.contacts;
    let found_var = false;
    for (let i = 0; i < list.length; i++) {
      if (list[i].name.toLowerCase().includes(seacrh_name.toLowerCase())) {
        list[i].show = true;
        found_var = true;
      } else {
        list[i].show = false;
      }
    }
    this.setState({contacts: list, found: found_var});
  }

  addfun() {
    let list = this.state.contacts;
    let new_name_var = this.state.new_name.trim();
    let new_phone_var = this.state.new_phone.trim();
    let exist = false;
    for (let i = 0; i < list.length; i++) {
      if (new_name_var == list[i].name) {
        alert('This name already exist');
        exist = true;
      }
      if (new_phone_var == list[i].phone) {
        alert('Phone number already exist');
        exist = true;
      }
    }
    if (new_name_var == '' && new_phone_var == '') {
      alert('Empty contact ');
    }
    if (exist == false) {
      let new_item = {
        name: new_name_var,
        phone: new_phone_var,
        show: true,
        select_favorite: false,
        img: require('./img/4.jpg'), //made
      };
      list.push(new_item);
    }
    this.store_contact(list);
    this.setState({contacts: list, new_name: '', new_phone: ''});
  }

  updatafun() {
    let list = this.state.contacts;
    let new_index = this.state.updata_index;
    let new_name = this.state.updata_name;
    let new_phone = this.state.updata_phone;

    let new_obj = {
      name: new_name,
      phone: new_phone,
      show: true,
      select_favorite: false,
      img: require('./img/4.jpg'),
    };

    list.splice(new_index, 1, new_obj);
    this.setState({contacts: list});
  }

  call(number) {
    let phoneNumber = '';
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${number}`;
    } else {
      phoneNumber = `telprompt:${number}`;
    }
    Linking.openURL(phoneNumber);
  }
  change_fav_icon(index) {
    let arr = this.state.contacts;
    arr[index].select_favorite = !arr[index].select_favorite;
    this.setState({contacts: arr});
  }
  add_to_favorite(index) {
    let arr = this.state.contacts;
    let arr_favorite = this.state.favorite;
    arr_favorite[index] = arr[index];

    if (!arr_favorite[index].name) {
      arr_favorite = [];
    }
    this.store_favorite(arr_favorite);
    this.setState({
      contacts: arr,
      favorite: arr_favorite,
    });
  }
  async store_contact(Arr) {
    await AsyncStorage.setItem('contacts', JSON.stringify(Arr));
  }
  async store_favorite(Arr_fav) {
    await AsyncStorage.setItem('favorite', JSON.stringify(Arr_fav));
  }
  async componentDidMount() {
    let arr = await AsyncStorage.getItem('contacts');
    let arr_fav = await AsyncStorage.getItem('favorite');
    if (!arr) {
      arr = [];
    } else {
      arr = JSON.parse(arr);
    }
    if (!arr_fav) {
      arr_fav = [];
    } else {
      arr_fav = JSON.parse(arr_fav);
    }
    this.setState({contacts: arr, favorite: arr_fav});
  }
  openWhatsApp = () => {
    let msg = this.state.message;
    let mobile = this.state.mobileNo;
    if (mobile) {
      if (msg) {
        let url =
          'whatsapp://send?text=' +
          this.state.message +
          '&phone=20' +
          this.state.mobileNo;
        Linking.openURL(url)
          .then(data => {
            console.log('WhatsApp Opened successfully ' + data);
          })
          .catch(() => {
            alert('Make sure WhatsApp installed on your device');
          });
      } else {
        alert('Please enter message to send');
      }
    }
    this.setState({message: msg, mobileNo: mobile, message: ''});
  };
  add_to_Recent() {
    let arr = this.state.detailObj;
    let arr_recent = this.state.recent;
    arr_recent = arr;

    if (!arr_recent.name) {
      arr_recent = [];
    }
    this.setState({
      detailObj: arr,
      recent: arr_recent,
    });
  }

  render() {
    return (
      <>
        <StatusBar backgroundColor="#2B2B2B" barStyle="light-content" />
        {this.state.selected == 1 ? (
          // HomePage
          <>
            <View style={styles.container}>
              {/* HeaderView */}
              <View style={styles.style_header}>
                <View style={styles.view_textinput}>
                  <TextInput
                    style={{flex: 1, paddingLeft: 8}}
                    placeholder="Search Name, Number ,etc.."
                    fontSize={16}
                    placeholderTextColor={'#ddd'}
                    color={'#ddd'}
                    value={this.state.search_value}
                    onChangeText={value => {
                      this.setState({search_value: value});
                      this.searchfun(value);
                    }}
                  />
                  <View
                    style={{
                      width: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon name={'search'} size={16} color={'#ddd'} />
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.plus_btn}
                  onPress={() => {
                    this.setState({visible_add: true});
                  }}>
                  <AntDesign name="pluscircle" size={23} color={'#ddd'} />
                </TouchableOpacity>
              </View>

              {/* Contacts */}
              <View style={{flex: 1}}>
                {this.state.contacts == '' ? (
                  <Text style={styles.no_contact_not_found}>
                    No Contact yet
                  </Text>
                ) : (
                  <ScrollView
                    contentContainerStyle={{alignItems: 'center'}}
                    showsVerticalScrollIndicator={false}>
                    {this.state.found ? (
                      this.state.contacts.map((contact, index) =>
                        contact.show ? (
                          <>
                            <TouchableOpacity
                              style={styles.viewContactItem}
                              onPress={() => {
                                this.setState({
                                  visible_detail: true,
                                  detailObj: contact,
                                });
                              }}
                              onLongPress={() => {
                                this.setState({
                                  visible_updata: true,
                                  updata_name: contact.name,
                                  updata_phone: contact.phone,
                                  updata_index: index,
                                });
                              }}>
                              <View style={styles.contact_img_text}>
                                <Image
                                  source={contact.img}
                                  style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                  }}
                                />
                                <View
                                  style={{
                                    width: '75%',
                                    height: '100%',
                                  }}>
                                  <Text style={{fontSize: 16, color: '#ddd'}}>
                                    {contact.name}
                                  </Text>
                                  <Text style={{fontSize: 16, color: '#999'}}>
                                    {contact.phone}
                                  </Text>
                                </View>
                              </View>

                              {/* starIcon */}
                              <TouchableOpacity
                                style={styles.star_btn}
                                onPress={() => {
                                  this.change_fav_icon(index);
                                  this.add_to_favorite(index);
                                }}>
                                <AntDesign
                                  name={'star'}
                                  size={20}
                                  color={
                                    contact.select_favorite ? '#fff' : null
                                  }
                                />
                              </TouchableOpacity>
                            </TouchableOpacity>
                          </>
                        ) : null,
                      )
                    ) : (
                      <Text style={styles.no_contact_not_found}>NOT FOUND</Text>
                    )}
                  </ScrollView>
                )}
              </View>

              {/* End Bar */}
              <View style={styles.container_end_header}>
                {/* Different way without map */}
                <TouchableOpacity
                  style={styles.head_end_icon}
                  onPress={() => {
                    this.setState({selected: 1});
                  }}>
                  <Icon
                    name="user-circle"
                    size={27}
                    color={this.state.selected == 1 ? '#fff' : '#5B666D'}
                  />

                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.selected == 1 ? '#fff' : '#5B666D',
                    }}>
                    Contact
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.head_end_icon}
                  onPress={() => {
                    this.setState({selected: 2});
                  }}>
                  <AntDesign
                    name="clockcircleo"
                    size={27}
                    color={this.state.selected == 2 ? '#fff' : '#5B666D'}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.selected == 2 ? '#fff' : '#5B666D',
                    }}>
                    Recent
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.head_end_icon}
                  onPress={() => {
                    this.setState({selected: 3});
                  }}>
                  <AntDesign
                    name="star"
                    size={27}
                    color={this.state.selected == 3 ? '#fff' : '#5B666D'}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.selected == 3 ? '#fff' : '#5B666D',
                    }}>
                    Favorite
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : this.state.selected == 2 ? (
          // RecentPage
          <>
            <View style={styles.containerRecentFav}>
              <Text style={styles.recent_fav_text}>Recent</Text>
              <View
                style={{
                  width: '100%',
                  height: 60,
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  style={styles.head_end_icon}
                  onPress={() => {
                    this.setState({selected: 1});
                  }}>
                  <Icon
                    name="user-circle"
                    size={30}
                    color={this.state.selected == 1 ? '#fff' : '#5B666D'}
                  />

                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.selected == 1 ? '#fff' : '#5B666D',
                    }}>
                    Contact
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.head_end_icon}
                  onPress={() => {
                    this.setState({selected: 2});
                  }}>
                  <AntDesign
                    name="clockcircleo"
                    size={30}
                    color={this.state.selected == 2 ? '#fff' : '#5B666D'}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.selected == 2 ? '#fff' : '#5B666D',
                    }}>
                    Recent
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.head_end_icon}
                  onPress={() => {
                    this.setState({selected: 3});
                  }}>
                  <AntDesign
                    name="star"
                    size={30}
                    color={this.state.selected == 3 ? '#fff' : '#5B666D'}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.selected == 3 ? '#fff' : '#5B666D',
                    }}>
                    Favorite
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : this.state.selected == 3 ? (
          //FavoritePage
          <>
            <View style={styles.containerRecentFav}>
              <>
                <Text style={styles.recent_fav_text}>Favorites</Text>
                <View style={{flex: 1, alignItems: 'center'}}>
                  {this.state.favorite.map((favorite_item, index) =>
                    favorite_item.name != '' ? (
                      <TouchableOpacity style={styles.viewContactItem}>
                        {/* favoriteContact */}
                        <View style={styles.contact_img_text}>
                          <Image
                            source={favorite_item.img}
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 25,
                            }}
                          />
                          <View
                            style={{
                              width: '75%',
                              height: '100%',
                            }}>
                            <Text style={{fontSize: 16, color: '#ddd'}}>
                              {favorite_item.name}
                            </Text>
                            <Text style={{fontSize: 16, color: '#999'}}>
                              {favorite_item.phone}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity style={styles.star_btn}>
                          <AntDesign
                            name={'star'}
                            size={20}
                            color={
                              favorite_item.select_favorite ? '#fff' : null
                            }
                          />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ) : null,
                  )}
                </View>
              </>

              <View
                style={[styles.container_end_header, {alignSelf: 'flex-end'}]}>
                <TouchableOpacity
                  style={styles.head_end_icon}
                  onPress={() => {
                    this.setState({selected: 1});
                  }}>
                  <Icon
                    name="user-circle"
                    size={30}
                    color={this.state.selected == 1 ? '#fff' : '#5B666D'}
                  />

                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.selected == 1 ? '#fff' : '#5B666D',
                    }}>
                    Contact
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.head_end_icon}
                  onPress={() => {
                    this.setState({selected: 2});
                  }}>
                  <AntDesign
                    name="clockcircleo"
                    size={30}
                    color={this.state.selected == 2 ? '#fff' : '#5B666D'}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.selected == 2 ? '#fff' : '#5B666D',
                    }}>
                    Recent
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.head_end_icon}
                  onPress={() => {
                    this.setState({selected: 3});
                  }}>
                  <AntDesign
                    name="star"
                    size={30}
                    color={this.state.selected == 3 ? '#fff' : '#5B666D'}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: this.state.selected == 3 ? '#fff' : '#5B666D',
                    }}>
                    Favorite
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : null}

        {/* Add ContactPage */}

        <Modal
          visible={this.state.visible_add}
          onRequestClose={() => {
            this.setState({visible_add: false});
          }}
          animationType="slide">
          <View style={styles.container}>
            <ScrollView
              contentContainerStyle={{alignItems: 'center', paddingTop: 10}}>
              <View style={styles.container_right_wrong}>
                <TouchableOpacity
                  style={styles.wroung_right_btn}
                  onPress={() => {
                    this.setState({visible_add: false});
                  }}>
                  <FontAwsome name={'close'} size={25} color={'#ddd'} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.wroung_right_btn}
                  onPress={() => {
                    this.addfun();
                    this.setState({
                      visible_add: false,
                    });
                  }}>
                  <Icon name={'check'} size={25} color={'#ddd'} />
                </TouchableOpacity>
              </View>

              <Image
                source={require('./img/4.jpg')}
                style={styles.view_imgAdd}
              />

              <View style={styles.container_new_name_phone}>
                <View style={styles.new_name_phone}>
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      alignItems: 'flex-start',
                      marginRight: 10,
                    }}>
                    <Icon name={'user'} size={20} color={'#ddd'} />
                  </View>
                  <TextInput
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      borderBottomWidth: 2,
                      borderBottomColor:
                        this.state.new_name == '' ? '#BCCEF6' : '#25407A',
                      color: '#ddd',
                      paddingTop: 30,
                    }}
                    placeholder="Name"
                    placeholderTextColor={'#ddd'}
                    value={this.state.new_name}
                    onChangeText={value => {
                      this.setState({new_name: value});
                    }}
                  />
                </View>
                <View style={styles.new_name_phone}>
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      alignItems: 'flex-start',
                      marginRight: 10,
                    }}>
                    <Icon name={'mobile'} size={20} color={'#ddd'} />
                  </View>

                  <TextInput
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      borderBottomWidth: 2,
                      borderBottomColor:
                        this.state.new_phone == '' ? '#BCCEF6' : '#25407A',
                      color: '#ddd',
                      paddingTop: 30,
                    }}
                    placeholder="Phone"
                    maxLength={11}
                    placeholderTextColor={'#ddd'}
                    keyboardType="number-pad"
                    value={this.state.new_phone}
                    onChangeText={value => {
                      this.setState({new_phone: value});
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>

        {/* Details Page */}

        <Modal
          visible={this.state.visible_detail}
          onRequestClose={() => {
            this.setState({visible_detail: false});
          }}
          animationType="slide">
          <View style={styles.container}>
            <ScrollView contentContainerStyle={{alignItems: 'center'}}>
              <View style={styles.headerBar_detail}>
                <TouchableOpacity
                  style={{
                    width: 90,
                    height: '100%',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    this.setState({visible_detail: false});
                  }}>
                  <Icon name={'arrow-left'} size={22} color={'#ddd'} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.edit_btn}
                  onPress={() => {
                    this.setState({
                      visible_updata: true,
                      updata_name: this.state.detailObj.name,
                      updata_phone: this.state.detailObj.phone,
                    });
                  }}>
                  <Text style={styles.no_contact_not_found}>Edit</Text>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: '80%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Image
                  style={styles.view_imgAdd}
                  source={this.state.detailObj.img}
                />
                <Text style={styles.name_detail}>
                  {this.state.detailObj.name}
                </Text>
                <TextInput
                  style={styles.viewTextInputDetail}
                  defaultValue={this.state.detailObj.phone}
                  maxLength={11}
                />

                <View style={styles.containerCallWhattsDelete}>
                  <TouchableOpacity
                    style={styles.view_call_and_whats_delete}
                    onPress={() => {
                      this.call(this.state.detailObj.phone);
                      this.add_to_Recent();
                    }}>
                    <Icon name={'phone-alt'} size={25} color={'#ddd'} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.view_call_and_whats_delete}
                    onPress={() => {
                      this.setState({
                        show_whatss: true,
                        mobileNo: this.state.detailObj.phone,
                      });
                    }}>
                    <Icon name={'whatsapp'} size={25} color={'#03ED2B'} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.view_call_and_whats_delete}>
                    <Icon name={'trash'} size={25} color={'#B70B0B'} />
                  </TouchableOpacity>
                </View>
                {this.state.show_whatss ? null : (
                  <View
                    style={{
                      width: width,
                      height: 100,
                      marginTop: 30,
                      paddingLeft: 20,
                    }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                      }}>
                      <Text style={{color: '#ddd', fontSize: 15}}>
                        Add To Favorites
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                      }}>
                      <Text style={{color: '#B70B0B', fontSize: 15}}>
                        Block this number
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </Modal>
        <Modal
          visible={this.state.show_whatss}
          onRequestClose={() => {
            this.setState({show_whatss: false});
          }}>
          <>
            <View style={styles.container}>
              <TextInput
                value={this.state.message}
                onChangeText={message => this.setState({message})}
                placeholder={'Enter message'}
                placeholderTextColor={'#ddd'}
                multiline={true}
                style={styles.input}
              />

              <TextInput
                value={this.state.mobileNo}
                onChangeText={mobileNo => this.setState({mobileNo})}
                style={[styles.input, {marginTop: 10, height: 50}]}
                keyboardType={'numeric'}
              />

              <TouchableOpacity
                style={styles.openWhatsApp_btn}
                onPress={this.openWhatsApp}>
                <Text style={{color: '#fff', fontSize: 15}}>
                  Open WhatsApp Message
                </Text>
              </TouchableOpacity>
            </View>
          </>
        </Modal>

        {/* Update Page */}

        <Modal
          visible={this.state.visible_updata}
          onRequestClose={() => {
            this.updatafun();
            this.setState({visible_updata: false, visible_detail: false});
          }}
          animationType="slide">
          <View style={{flex: 1, backgroundColor: '#2B2B2B'}}>
            <ScrollView
              contentContainerStyle={{alignItems: 'center'}}
              showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.wroung_right_btn,{alignSelf:'flex-end',marginVertical:10}]}
                onPress={() => {
                  this.updatafun();
                  this.setState({
                    visible_updata: false,
                    visible_detail: false,
                  });
                }}>
                <FontAwsome name="check" size={25} color={'#ddd'} />
              </TouchableOpacity>
              <View
                style={{
                  width: width * 0.8,
                  height: 150,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                  }}>
                  <Icon
                    name={'user'}
                    size={20}
                    color={'#ddd'}
                    style={{alignSelf: 'flex-end', marginRight: 10}}
                  />

                  <TextInput
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      borderBottomWidth: 2,
                      borderBottomColor:
                        this.state.updata_name == '' ? '#BCCEF6' : '#25407A',
                      color: '#ddd',
                      paddingTop: 50,
                    }}
                    placeholder="Name"
                    placeholderTextColor={'#ddd'}
                    value={this.state.updata_name}
                    onChangeText={value => {
                      this.setState({updata_name: value});
                    }}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                  }}>
                  <Icon
                    name={'mobile'}
                    size={20}
                    color={'#ddd'}
                    style={{alignSelf: 'flex-end', marginRight: 10}}
                  />

                  <TextInput
                    style={{
                      flex: 1,
                      borderRadius: 10,
                      borderBottomWidth: 2,
                      borderBottomColor:
                        this.state.updata_phone == '' ? '#BCCEF6' : '#25407A',
                      color: '#ddd',
                      paddingTop: 50,
                    }}
                    placeholder="Phone"
                    maxLength={11}
                    placeholderTextColor={'#ddd'}
                    value={this.state.updata_phone}
                    onChangeText={value => {
                      this.setState({updata_phone: value});
                    }}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  plus_btn: {
    width: width * 0.1,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  no_contact_not_found: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#ddd',
    marginTop: 30,
  },
  viewContactItem: {
    width: width * 0.9,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  contact_img_text: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  star_btn: {
    width: 40,
    height: '70%',
    borderRadius: 20,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  recent_fav_text: {
    margin: 15,
    paddingLeft: 8,
    color: '#ddd',
    fontSize: 22,
    fontWeight: 'bold',
  },
  view_textinput: {
    width: width * 0.8,
    height: 50,
    alignSelf: 'center',
    backgroundColor: '#5B666D',
    flexDirection: 'row',
    borderRadius: 10,
  },
  style_header: {
    width: width * 0.9,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#2B2B2B',
  },
  containerRecentFav: {
    flex: 1,
    backgroundColor: '#2B2B2B',
    paddingTop: 15,
    justifyContent: 'space-between',
  },
  container_right_wrong: {
    width: width * 0.9,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  wroung_right_btn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  view_imgAdd: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  container_new_name_phone: {
    width: width * 0.8,
    height: height * 0.2,
    justifyContent: 'space-between',
    marginTop: 50,
  },
  new_name_phone: {
    height: '40%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  head_end_icon: {
    height: '100%',
    width: width / 3,
    alignItems: 'center',
    paddingVertical: 8,
  },
  container_end_header: {
    width: width,
    height: 60,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBar_detail: {
    width: width,
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  edit_btn: {
    width: 100,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  name_detail: {
    alignSelf: 'center',
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ddd',
    marginTop: 10,
  },
  viewTextInputDetail: {
    width: width * 0.9,
    height: 70,
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#575757',
    paddingLeft: 10,
    color: '#7E7E7E',
    fontSize: 23,
  },
  containerCallWhattsDelete: {
    width: width * 0.9,
    height: 60,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  view_call_and_whats_delete: {
    width: 90,
    height: 50,
    borderRadius: 10,
    borderColor: '#575757',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: width * 0.9,
    height: 90,
    backgroundColor: '#5B666D',
    marginTop: 100,
    borderRadius: 10,
    color: '#ddd',
    paddingHorizontal: 10,
    fontSize: 18,
    marginVertical: 3,
  },
  openWhatsApp_btn: {
    width: 200,
    height: 50,
    backgroundColor: '#5B666D',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 10,
  },
})
