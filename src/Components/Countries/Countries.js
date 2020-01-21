import React from 'react';
import Input from '../Input/Input';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import "./country.css"

const useStyles = makeStyles({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default class Countries extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEmpty: false,
      isLoading: false,
      errorText: "",
      countries: [],
    }
  }

  componentDidMount() {
    this.setState({isLoading: true});

    this.fetchCountries();
  }

  fetchCountries = (countryName = "") => {
    if (countryName) {
      fetch(`https://restcountries.eu/rest/v2/name/${countryName}`)
        .then(res => res.json())
        .then((res) => {
          if (res.status === 404) {
            throw new Error('No Data')
          }
          return res;
        })
        .then(res => this.setState({
          countries: res, isEmpty: res.length === 0,
          isLoading: false, errorText: ""
        }))
        .catch(err => this.setState({isLoading: false, errorText: err.message, countries: []}));
    } else {
      fetch('https://restcountries.eu/rest/v2/all')
        .then(res => res.json())
        .then(res => this.setState({countries: res, isEmpty: res.length === 0, isLoading: false}))
        .catch(err => this.setState({isLoading: false, errorText: err.message}));
    }
  };

  searchCountry = (countryName) => {
    this.setState({isLoading: true});

    this.fetchCountries(countryName);
  };

  render() {
    const {isEmpty, isLoading, errorText, countries} = this.state;
    // const classes = useStyles();
    // const bull = <span className={classes.bullet}>•</span>;

    return (
      <div>
        <Input onInputClick={this.searchCountry}/>
        {errorText
          ? <p>{errorText}</p>
          : isEmpty
            ? <p>No Data</p>
            : isLoading
              ? <p>Loading ...</p>
              : countries.map(country => 
              <Card className="countryCard">
                <CardContent className="countryContent">
                  <Typography className="countryDetails"  color="textSecondary" gutterBottom>
                    <p key={country.name}>country: {country.name}</p>
                  </Typography>
                  <Typography className="countryDetails" color="textSecondary" gutterBottom>
                    <p key={country.population}>population: {country.population}</p>
                  </Typography>
                  <Typography className="countryDetails" color="textSecondary" gutterBottom>
                    <p key={country.capital}>capital: {country.capital}</p>
                  </Typography>
                </CardContent>
                <CardActions className="learnMore">
                  <Button size="small">Learn More</Button>
                </CardActions>  
              </Card>
              
              )
        }
      </div>
    );
  }
}