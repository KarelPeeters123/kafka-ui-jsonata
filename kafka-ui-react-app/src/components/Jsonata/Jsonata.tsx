import React, { Suspense, useContext, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  accessErrorPage,
  clusterPath,
  errorPage,
  getNonExactPath,
  clusterNewConfigPath,
} from 'lib/paths';
import PageLoader from 'components/common/PageLoader/PageLoader';
import Dashboard from 'components/Dashboard/Dashboard';
import ClusterPage from 'components/ClusterPage/ClusterPage';
import { ThemeProvider } from 'styled-components';
import { theme, darkTheme } from 'theme/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { showServerError } from 'lib/errorHandling';
import { Toaster } from 'react-hot-toast';
import GlobalCSS from 'components/globalCss';
import * as S from 'components/App.styled';
import ClusterConfigForm from 'widgets/ClusterConfigForm';
import { ThemeModeContext } from 'components/contexts/ThemeModeContext';
import { ButtonWrapper, JsonataObject, JsonataQuery, Wrapper, TextArea, JsonWrapper } from './Jsonata.styled';
import { Button } from 'components/common/Button/Button';

import jsonata from "jsonata";
import ReactJson from 'react-json-view'

const Jsonata: React.FC = () => {
  const { isDarkMode } = useContext(ThemeModeContext);
  const [jsonObject, setJsonObject] = useState(
    {
        "FirstName": "Fred",
        "Surname": "Smith",
        "Age": 28,
        "Address": {
            "Street": "Hursley Park",
            "City": "Winchester",
            "Postcode": "SO21 2JN"
        },
        "Phone": [
            {
                "type": "home",
                "number": "0203 544 1234"
            },
            {
                "type": "office",
                "number": "01962 001234"
            },
            {
                "type": "office",
                "number": "01962 001235"
            },
            {
                "type": "mobile",
                "number": "077 7700 1234"
            }
        ],
        "Email": [
            {
                "type": "office",
                "address": [
                    "fred.smith@my-work.com",
                    "fsmith@my-work.com"
                ]
            },{
                "type": "home",
                "address": [
                    "freddy@my-social.com",
                    "frederic.smith@very-serious.com"
                ]
            }
        ],
        "Other": {
            "Over 18 ?": true,
            "Misc": null,
            "Alternative.Address": {
                "Street": "Brick Lane",
                "City": "London",
                "Postcode": "E1 6RF"
            }
        }
    });
  const [query, setQuery] = useState('');
  const [output, setOutput] = useState({});

  const applyQuery = async () => {
    if (query) {
        var result = await jsonata(query).evaluate(jsonObject);
        setOutput(result);
    }
  }
  const updateQuery = (e: any) => {
    setQuery(e.target.value);
  }
  const copyQueryToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(query);
      console.log('Content copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

    return (
        <Wrapper>
            <JsonataObject>
                <JsonWrapper>
                    <ReactJson src={jsonObject} theme="summerfruit:inverted"/>
                </JsonWrapper>
            </JsonataObject>
            <JsonataQuery>
                <div className='jsonata query input' style={{height: '50%'}}>
                    <TextArea value={query} onChange={updateQuery}/>
                </div>
                <ButtonWrapper>
                    <Button buttonType="primary" buttonSize="L" style={{margin: '5px'}} onClick={applyQuery}>
                        Run Query
                    </Button>
                    <Button buttonType="primary" buttonSize="L" style={{margin: '5px'}} onClick={copyQueryToClipboard}>
                        Copy Query
                    </Button>
                    <Button buttonType="primary" buttonSize="L" style={{margin: '5px'}}>
                        Save Query
                    </Button>
                </ButtonWrapper>
                <JsonWrapper style={{height: '50%'}}>
                    <ReactJson src={output} theme="summerfruit:inverted"/>
                </JsonWrapper>
            </JsonataQuery>
        </Wrapper>
    )
};

export default Jsonata;
