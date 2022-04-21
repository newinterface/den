import React from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import ProductItem from 'src/containers/ProductItem';
import {padding} from 'src/components/config/spacing';
import ProductItemLoading from 'src/containers/ProductItem/Loading';

class Style4 extends React.Component {
  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
  }
  renderFooter = () => {
    if (!this.props.loadingMore) {
      return <View style={styles.viewFooter} />;
    }

    return (
      <View style={[styles.viewFooter, styles.viewLoadingFooter]}>
        <ActivityIndicator animating size="small" />
      </View>
    );
  };

  onEndReachedComponent() {
    this.props.handleLoadMore();
    this.onEndReachedCalledDuringMomentum = false;
  }
  render() {
    const {data, loading, refreshing, handleRefresh} = this.props;

    if (loading) {
      const dataLoading = new Array(6).fill(0);
      return (
        <FlatList
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => `${index}`}
          data={dataLoading}
          renderItem={_ => (
            <ProductItemLoading
              type="item2"
              containerStyle={{marginHorizontal: padding.large}}
            />
          )}
        />
      );
    }

    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => `${item.id}`}
        data={data}
        renderItem={({item}) => (
          <ProductItem
            item={item}
            type="item2"
            containerStyle={{marginHorizontal: padding.large}}
          />
        )}
        onMomentumScrollBegin={() =>
          (this.onEndReachedCalledDuringMomentum = false)
        }
        onEndReached={() => this.onEndReachedComponent()}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        ListFooterComponent={this.renderFooter}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    );
  }
}

const styles = StyleSheet.create({
  viewFooter: {
    marginBottom: 26,
  },
  viewLoadingFooter: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
});

export default Style4;
