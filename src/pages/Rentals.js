import React, { useState, useEffect } from "react";
import "./Rentals.css";
import { Link } from "react-router-dom";
import {useLocation} from "react-router";
import logo from "../images/airbnbRed.png";
import {ConnectButton, Icon, Button, useNotification} from "web3uikit";
import RentalsMap from "../components/RentalsMap";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import User from "../components/User";


const Rentals = () => {
  const {state: searchFilters } = useLocation();
  const [ highLight ,setHighLight] = useState();
  const {Moralis, account} = useMoralis();
  const [ rentalsList, setRentalsList] = useState();
  const [coOrdinates, setCoOrdinates] = useState();
  const contractProcessor = useWeb3ExecuteFunction();
  const dispatch = useNotification();

  const handleSuccess =()=>{
    dispatch({
      type: "success",
      message:`Nice! You are going to ${searchFilters.destination}!!`,
      title: "Booking Successful",
      position: "topL"
    });
  };
  
  function handleError(msg){
    dispatch({
      type: "error",
      message: `${msg}`,
      title:"Booking Failed",
      position: "topL"
    });
  };

  const handleNoAccount = ()=>{
    dispatch({
      type: "error",
      message: 'You need to connect to wallet to book a rental',
      title:"Not Connected",
      position: "topL"
    });
  };

  
  useEffect(() => {
    const fetchRentalsList = async() =>{
      const Rentals = Moralis.Object.extend("Rental");
      const query = new Moralis.Query(Rentals);
      query.equalTo("city", searchFilters.destination);
      query.greaterThanOrEqualTo("maxGuests_decimal", searchFilters.guests);

      const result = await query.find();


      const cords =[];
      result.forEach(function(e){
        cords.push({lat:e.attributes.lat, lng:e.attributes.long})
      });

      setCoOrdinates(cords);
      setRentalsList(result);
    }
    fetchRentalsList();
  }, [searchFilters]);

  const bookRental = async function (start, end, id, dayPrice){
    for ( 
      let arr = [], dt = new Date(start);
    dt  <= end;
    dt.setDate(dt.getDate()+1)
    ){
      arr.push(new Date(dt).toISOString().slice(0,10));
    //yyyy-mm-dd
    
    let options = {
      contractAddress: "0x08F9a49519B956463eea1169131D5D5315Cf2307",
      functionName: "addDatesBooked",
      abi: [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "string[]",
              "name": "datesBooked",
              "type": "string[]"
            },
            {
              "indexed": false,
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "indexed": false,
              "internalType": "address",
              "name": "booker",
              "type": "address"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "city",
              "type": "string"
            },
            {
              "indexed": false,
              "internalType": "string",
              "name": "imgUrl",
              "type": "string"
            }
          ],
          "name": "newDatesBooked",
          "type": "event"
        }
      ],
      params: {
        id: id,
        newBookings: arr,
      },
      msgValue: Moralis.Units.ETH(dayPrice * arr.length),
    }

    await contractProcessor.fetch({
      params:options,
      onSuccess:() => {
        handleSuccess();
      },
      onError: (error)=>{
        handleError(error.data.message)
      }
    });
  }
  }

  return (
    <>
     {searchFilters && console.log(searchFilters)}
     <div className="topBanner">
        <div>
        <Link to="/">  
          <img className="logo" src={logo} alt="logo"></img>
        </Link>
        </div>
        <div className="searchReminder">

          <div className="filter">
            {searchFilters.destination}
          </div>
          <div className="vl"/>
          <div className="filter">
            {`${searchFilters.checkIn.toLocaleString("default", {month:"short",})}
              ${searchFilters.checkIn.toLocaleString("default", {day:"2-digit",})}
              -
              ${searchFilters.checkOut.toLocaleString("default", {month:"short",})}
              ${searchFilters.checkOut.toLocaleString("default", {day:"2-digit",})}
              `}

          </div>
          <div className="vl"/>
          <div className="filter">
            {searchFilters.guests} Guest(s)
          </div>
          <div className="searchFiltersIcon">
            <Icon fill="#ffffff" size={20} svg="search"/>
          </div>
        </div>
        <div className="lrContainers">
          <User/>
          <ConnectButton/>
        </div>
      </div>

      <hr className="line"/>
      <div className="rentalsContent">
        <div className="rentalsContentL">
          Stays available for your global destinations
          {rentalsList && 
          rentalsList.map((e, i)=>{
            return(
              <>
                <hr className="line2"/>
                <div className={highLight == i ? "rentalDivH":"rentalDiv"} >
                  <img className="rentalImg" src={e.attributes.imgUrl} ></img>
                  <div className="rentalInfo" >
                    <div className="rentalTitle">{e.attributes.name}</div>
                    <div className="rentalDesc">
                      {e.attributes.unoDescription}
                    </div>
                    <div className="rentalDesc" >
                      {e.attributes.dosDescription}
                    </div>
                    <div className="bottomButton" >
                      <Button 
                      onClick={()=>{
                        if(account){
                          bookRental(
                            searchFilters.checkIn,
                            searchFilters.checkOut,
                            e.attributes.uid_decimal.value.$numberDecimal,
                            Number(e.attributes.pricePerDay_decimal.value.$numberDecimal)
                          )}else{
                            handleNoAccount()
                          }
                      }}
                      text="Stay Here"/>
                      <div className="price" >
                        <Icon fill="#808080" size={10} svg="matic" />{" "}
                        {e.attributes.pricePerDay}/Day
                      </div>
                    </div>
                  </div>
                </div>
              
              </>
            )
          })}
        </div>
        <div className="rentalsContentR">
          <RentalsMap locations={coOrdinates} setHighLight={setHighLight}/>
        </div>
      </div>
    </>
  );
};

export default Rentals;
