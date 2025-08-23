import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { TabBar, TabView } from 'react-native-tab-view';
import axios from 'axios';
import { getBaseURL, API_ENDPOINTS } from '../config/api';
import PieChart from 'react-native-pie-chart';


const StatsScreen = () => { 
    const [currentDate, setCurrentDate] = useState(moment());
  const [index, setIndex] = useState(0);
  const [option, setOption] = useState('Budget');
  const [expenses, setExpenses] = useState([]);
  const date = currentDate.format('MMMM YYYY');
  const [isLoading, setIsLoading] = useState(false);
  

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => moment(prevDate).subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => moment(prevDate).add(1, 'month'));
  };

   useEffect(()=>{
  fetchExpenses();
 },[currentDate]);
 const fetchExpenses=async()=>{
  try {
    setIsLoading(true);
    console.log("Fetching expenses for date:", date);
    
    const response = await axios.get(`${getBaseURL()}${API_ENDPOINTS.expenses}`, {
      params: { date } 
    });
    console.log(response)
    
    if (response.data.success) {
      setExpenses(response.data.data || []);
      ;
      console.log(` Loaded ${response.data.count} expenses`);
    } else {
      console.log(" API returned error:", response.data.message);
      setExpenses([]);
    }
    console.log("expense in stats",expenses)
  } catch (error) {
    console.log("Error fetching expenses:", error);
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.log('Network Error: Make sure your backend server is running');
    }
    setExpenses([]);
  } finally {
    setIsLoading(false);
  }
 }



  const [routes,setRoute]= useState([
    {
      key:"edit",
      title:"Income",
    },
    {
      key:"view",
      title:"Expense"
    }
  ])
  const renderScene= ({route})=>{
    console.log(route)
    switch(route.key){
      case "edit":
        return <Income/>
      case "view":
        return <Expense/>
    }
  }

    const totalExpense = expenses
    .filter(expense => expense.type == 'Expense')
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const totalIncome = expenses
    .filter(expense => expense.type == 'Income')
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

const RenderPieChart = () => {
     const data = [
      50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80,
    ];

    const randomColor = () =>
      ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(
        0,
        7,
      );

        const pieData = expenses
      .filter(expense => expense.type === 'Income') 
      .map((expense, index) => ({
        value: parseFloat(expense.amount), 
        color:randomColor(),
        key: `pie-${index}`,
       
       
        category: expense.category,
        price: expense.amount,
        
      }));
      console.log("Pie data",pieData) 


             return (
         <View>
          <View style={{alignItems: 'center', marginVertical: 20}}>
            <PieChart widthAndHeight={200} series={pieData} cover={{ radius: 0.45, color: '#e6f7e3' }} padAngle ={0.045 }/>
          </View>
         
          
           {pieData.map((data, index) => (
            
          <View
            key={index}
            style={{
              padding: 12,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                <View
                  style={{
                    backgroundColor: data?.color,
                    alignSelf: 'flex-start',
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    width: 70,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      textAlign: 'center',
                      color: 'white',
                      fontWeight: '500',
                    }}>
                    {Math.round((data.value / totalIncome) * 100)}%
                  </Text>
                </View>
                <Text style={{fontSize: 15, textAlign: 'center'}}>
                  {data?.category}
                </Text>
              </View>
              <View>
                <Text>{Number(data?.price).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        ))}
        </View>
      )
  };

  const RenderPieChartExpense=()=>{
     const data = [
      50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80,
    ];

    const randomColor = () =>
      ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(
        0,
        7,
      );

        const pieData = expenses
      .filter(expense => expense.type === 'Expense') 
      .map((expense, index) => ({
        value: parseFloat(expense.amount), 
        color:randomColor(),
        key: `pie-${index}`,
       
       
        category: expense.category,
        price: expense.amount,
        
      }));
      console.log("Pie data",pieData) 


             return (
         <View>
          <View style={{alignItems: 'center', marginVertical: 20}}>
            <PieChart widthAndHeight={200} series={pieData} cover={{ radius: 0.45, color: '#e6f7e3' }} padAngle ={0.045 }/>
          </View>
         
          
           {pieData.map((data, index) => (
            
          <View
            key={index}
            style={{
              padding: 12,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 7}}>
                <View
                  style={{
                    backgroundColor: data?.color,
                    alignSelf: 'flex-start',
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    width: 70,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      textAlign: 'center',
                      color: 'white',
                      fontWeight: '500',
                    }}>
                    {Math.round((data.value / totalIncome) * 100)}%
                  </Text>
                </View>
                <Text style={{fontSize: 15, textAlign: 'center'}}>
                  {data?.category}
                </Text>
              </View>
              <View>
                <Text>{Number(data?.price).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        ))}
        </View>
      )

  }


  const Income=()=>{
    return(
        <View style={{backgroundColor: 'white'}}>
      <View>
        {option == 'Budget' && (
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 12,
              }}>
              <View>
                <Text style={{color: 'gray', fontSize: 15}}>
                  Remaining (Monthly)
                </Text>

                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 19,
                    fontWeight: '500',
                    letterSpacing: 0.5,
                  }}>
                  1000.00
                </Text>
              </View>

              <View
                style={{
                  padding: 10,
                  backgroundColor: '#E0E0E0',
                  borderRadius: 8,
                  alignSelf: 'flex-start',
                }}>
                <Text>Budget Setting</Text>
              </View>
            </View>

            {expenses
              ?.filter(item => item.type === 'Income')
              .map((item, index) => (
                <Pressable
                key={index+9}
                  style={{
                    backgroundColor: 'white',
                    borderTopColor: '#E0E0E0',
                    borderTopWidth: 0.6,
                    padding: 14,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontWeight: '500'}}>{item?.category}</Text>
                    <Text>{Number(item?.amount).toFixed(2)}</Text>
                  </View>
                </Pressable>
              ))}
          </View>
        )}

        {option == 'Stats' && (
          <View style={{marginVertical: 10}}>
            <RenderPieChart />
          </View>
        )}
      </View>
    </View>
    )
   
  }
  const Expense=()=>{
    return(
       <View style={{backgroundColor: 'white'}}>
      <View>
        {option == 'Budget' && (
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 12,
              }}>
              <View>
                <Text style={{color: 'gray', fontSize: 15}}>
                  Remaining (Monthly)
                </Text>

                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 19,
                    fontWeight: '500',
                    letterSpacing: 0.5,
                  }}>
                  1000.00
                </Text>
              </View>

              <View
                style={{
                  padding: 10,
                  backgroundColor: '#E0E0E0',
                  borderRadius: 8,
                  alignSelf: 'flex-start',
                }}>
                <Text>Budget Setting</Text>
              </View>
            </View>

            {expenses
              ?.filter(item => item.type === 'Expense')
              .map((item, index) => (
                <Pressable
                key={index+4}
                  style={{
                    backgroundColor: 'white',
                    borderTopColor: '#E0E0E0',
                    borderTopWidth: 0.6,
                    padding: 14,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontWeight: '500'}}>{item?.category}</Text>
                    <Text>{Number(item?.amount).toFixed(2)}</Text>
                  </View>
                </Pressable>
              ))}
          </View>
        )}

        {option == 'Stats' && (
          <View>
            <RenderPieChartExpense />
          </View>
        )}
      </View>
    </View>
    )

  }
  return (
   
    <SafeAreaView style={{flex: 1}}>
      <View style={{padding: 12}}>
        <View
          style={{
            backgroundColor: '#E0E0E0',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 20,
            borderRadius: 12,
          }}>
          <Pressable
            onPress={() => setOption('Stats')}
            style={{
              backgroundColor: option == 'Stats' ? 'white' : '#E0E0E0',
              padding: 12,
              flex: 1,
              borderRadius: 12,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: option == 'Stats' ? 'orange' : '#606060',
              }}>
              Stats
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setOption('Budget')}
            style={{
              backgroundColor: option == 'Budget' ? 'white' : '#E0E0E0',
              padding: 12,
              flex: 1,
              borderRadius: 12,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: option == 'Budget' ? 'orange' : '#606060',
              }}>
              Budget
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setOption('Note')}
            style={{
              backgroundColor: option == 'Note' ? 'white' : '#E0E0E0',
              padding: 12,
              flex: 1,
              borderRadius: 12,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: option == 'Note' ? 'orange' : '#606060',
              }}>
              Note
            </Text>
          </Pressable>
        </View>

        {option == 'Budget' && (
          <View>
            <View
              style={{
                paddingTop: 15,
                marginHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <MaterialDesignIcons
                onPress={handlePrevMonth}
                name="chevron-left"
                size={23}
                color="black"
              />

              <Text style={{fontSize: 16, fontWeight: '400', color: 'black'}}>
                {currentDate.format('MMM YYYY')}
              </Text>

              <MaterialDesignIcons
                onPress={handleNextMonth}
                name="chevron-right"
                size={23}
                color="black"
              />
            </View>
          </View>
        )}
      </View>

      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: '100%'}}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{backgroundColor: 'black'}}
            style={{backgroundColor: 'white'}}
            labelStyle={{fontWeight: 'bold'}}
            activeColor="black"
            inactiveColor="gray"
          />
        )}
      />
    </SafeAreaView>
  )
}

export default StatsScreen

const styles = StyleSheet.create({})