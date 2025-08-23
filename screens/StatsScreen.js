import {StyleSheet, Text, View, SafeAreaView, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import moment from 'moment';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {TabBar, TabView} from 'react-native-tab-view';
import axios from 'axios';
import PieChart from 'react-native-pie-chart';
import { getBaseURL, API_ENDPOINTS } from '../config/api';

const StatsScreen = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [index, setIndex] = useState(0);
  const [option, setOption] = useState('Stats');
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const date = currentDate.format('MMMM YYYY');

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => moment(prevDate).subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => moment(prevDate).add(1, 'month'));
  };

  useEffect(() => {
    fetchExpenses();
  }, [currentDate]);

  // Add refresh capability
  const handleRefresh = () => {
    fetchExpenses();
  };

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching expenses for stats, date:", date);
      
      const response = await axios.get(`${getBaseURL()}${API_ENDPOINTS.expenses}`, {
        params: {date},
      });
      
      if (response.data.success) {
        setExpenses(response.data.data || []);
        console.log(`✅ Loaded ${response.data.data?.length || 0} expenses for stats`);
      } else {
        console.log("❌ API returned error:", response.data.message);
        setExpenses([]);
      }
    } catch (error) {
      console.log('❌ Error fetching expenses for stats:', error);
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        console.log('Network Error: Make sure your backend server is running');
      }
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const totalExpense = expenses
    .filter(expense => expense.type == 'Expense')
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const totalIncome = expenses
    .filter(expense => expense.type == 'Income')
    .reduce((total, expense) => total + parseFloat(expense.amount), 0);

  const [routes, setRoutes] = useState([
    {key: 'edit', title: `Income`},
    {key: 'view', title: 'Expense'},
  ]);

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'edit':
        return <Income />;
      case 'view':
        return <Expense />;
    }
  };

  const RenderPieChart = () => {
    if (isLoading) {
      return (
        <View style={{padding: 40, alignItems: 'center'}}>
          <Text style={{fontSize: 16, color: '#666', textAlign: 'center'}}>
            Loading income data...
          </Text>
        </View>
      );
    }

    const incomeExpenses = expenses.filter(expense => expense.type === 'Income');
    
    if (incomeExpenses.length === 0) {
      return (
        <View style={{padding: 40, alignItems: 'center'}}>
          <Text style={{fontSize: 16, color: '#666', textAlign: 'center'}}>
            No income data found for {date}
          </Text>
        </View>
      );
    }

    const randomColor = () =>
      ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(
        0,
        7,
      );

    const pieData = incomeExpenses.map((expense, index) => ({
      value: parseFloat(expense.amount),
      svg: {
        fill: randomColor(),
        onPress: () => console.log('press', index),
      },
      key: `pie-${index}`,
      category: expense.category,
      price: expense.amount,
    }));

    return (
      <View>
        <PieChart style={{height: 200}} data={pieData} />
        {pieData.map((data, index) => (
          <View
            key={data.key}
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
                    backgroundColor: data?.svg?.fill,
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
                    {totalIncome > 0 ? Math.round((data.value / totalIncome) * 100) : 0}%
                  </Text>
                </View>
                <Text style={{fontSize: 15, textAlign: 'center'}}>
                  {data?.category}
                </Text>
              </View>
              <View>
                <Text>₹{Number(data?.price).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const RenderPieChartExpense = () => {
    if (isLoading) {
      return (
        <View style={{padding: 40, alignItems: 'center'}}>
          <Text style={{fontSize: 16, color: '#666', textAlign: 'center'}}>
            Loading expense data...
          </Text>
        </View>
      );
    }

    const expenseItems = expenses.filter(expense => expense.type === 'Expense');
    
    if (expenseItems.length === 0) {
      return (
        <View style={{padding: 40, alignItems: 'center'}}>
          <Text style={{fontSize: 16, color: '#666', textAlign: 'center'}}>
            No expense data found for {date}
          </Text>
        </View>
      );
    }

    const randomColor = () =>
      ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(
        0,
        7,
      );

    const pieData = expenseItems.map((expense, index) => ({
      value: parseFloat(expense.amount),
      svg: {
        fill: randomColor(),
        onPress: () => console.log('press', index),
      },
      key: `pie-${index}`,
      category: expense.category,
      price: expense.amount,
    }));

    return (
      <View style={{marginTop: 20}}>
        <PieChart style={{height: 200}} data={pieData} />

        {pieData?.map((data, index) => (
          <View key={data.key} style={{padding: 12}}>
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
                    backgroundColor: data?.svg?.fill,
                    alignSelf: 'flex-start',
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    width: 50,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      textAlign: 'center',
                      color: 'white',
                      fontWeight: '500',
                    }}>
                    {totalExpense > 0 ? Math.round((data.value / totalExpense) * 100) : 0}%
                  </Text>
                </View>

                <Text style={{fontSize: 15, textAlign: 'center'}}>
                  {data?.category}
                </Text>
              </View>
              <View>
                <Text>₹{Number(data?.price).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const Income = () => (
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
                  ₹{totalIncome > 0 ? (totalIncome - totalExpense).toFixed(2) : '0.00'}
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

            {isLoading ? (
              <View style={{padding: 20, alignItems: 'center'}}>
                <Text style={{color: 'gray', fontSize: 14}}>Loading...</Text>
              </View>
            ) : expenses.length === 0 ? (
              <View style={{padding: 20, alignItems: 'center'}}>
                <Text style={{color: 'gray', fontSize: 14}}>No data found</Text>
              </View>
            ) : (
              expenses
                .filter(item => item.type === 'Income')
                .map((item, index) => (
                  <Pressable
                    key={index}
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
                      <Text>₹{Number(item?.amount).toFixed(2)}</Text>
                    </View>
                  </Pressable>
                ))
            )}
          </View>
        )}

        {option == 'Stats' && (
          <View style={{marginVertical: 10}}>
            <RenderPieChart />
          </View>
        )}
      </View>
    </View>
  );

  const Expense = () => (
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
                  ₹{totalExpense > 0 ? (1000 - totalExpense).toFixed(2) : '1000.00'}
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

            {isLoading ? (
              <View style={{padding: 20, alignItems: 'center'}}>
                <Text style={{color: 'gray', fontSize: 14}}>Loading...</Text>
              </View>
            ) : expenses.length === 0 ? (
              <View style={{padding: 20, alignItems: 'center'}}>
                <Text style={{color: 'gray', fontSize: 14}}>No data found</Text>
              </View>
            ) : (
              expenses
                .filter(item => item.type === 'Expense')
                .map((item, index) => (
                  <Pressable
                    key={index}
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
                      <Text>₹{Number(item?.amount).toFixed(2)}</Text>
                    </View>
                  </Pressable>
                ))
            )}
          </View>
        )}

        {option == 'Stats' && (
          <View>
            <RenderPieChartExpense />
          </View>
        )}
      </View>
    </View>
  );
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
            
            {/* Refresh button */}
            <View style={{paddingHorizontal: 10, paddingTop: 10}}>
              <Pressable
                onPress={handleRefresh}
                style={{
                  backgroundColor: '#0578eb',
                  padding: 8,
                  borderRadius: 6,
                  alignSelf: 'flex-end'
                }}
              >
                <Text style={{color: 'white', fontSize: 12, fontWeight: '500'}}>
                  Refresh
                </Text>
              </Pressable>
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
  );
};

export default StatsScreen;

const styles = StyleSheet.create({});