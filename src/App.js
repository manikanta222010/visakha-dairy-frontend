import React from 'react';
import { Switch, Route } from "react-router-dom";
import { Home } from './Components/Home';
import { Producers } from './Components/Producers';
import { CattleInformation } from './Components/CattleInformation';
import { MilkReceipts } from './Components/MilkReceipts';
import { MilkReceiptsFnConsolidated } from './Components/MilkReceiptsFnConsolidated';
import { RecoveriesEntryFn } from './Components/RecoveriesEntryFn';
import { Bcc } from './Components/Bcc';
import { Societies } from './Components/Societies';
import { FnConsolidatedProducer } from './Components/FnConsolidatedProducer';
import { HeadQuarters } from './Components/HeadQuarters';
import { Login } from './Components/Login';
import { IndividualReport } from './Components/IndividualReport';

function App() {


  return (
    <>

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/individual-report">
          <IndividualReport />
        </Route>
        <Route exact path="/headquarters">
          <HeadQuarters />
        </Route>
        <Route exact path="/headquarters/:hqCode/bcc/:bccCode/societies/:societyCode/producers">
          <Producers />
        </Route>
        <Route exact path="/headquarters/:hqCode/bcc/:bccCode/societies/:societyCode/producers/:pno/fn-consolidated-producer">
          <FnConsolidatedProducer />
        </Route>
        <Route exact path="/headquarters/:hqCode/bcc/:bccCode/societies/:societyCode/producers/:pno/cattle-information">
          <CattleInformation />
        </Route>
        <Route exact path="/milk-receipts">
          <MilkReceipts />
        </Route>
        <Route exact path="/milk-receipts-fn-consolidated">
          <MilkReceiptsFnConsolidated />
        </Route>
        <Route exact path="/recoveries-entry-fn">
          <RecoveriesEntryFn />
        </Route>
        <Route exact path="/headquarters/:hqCode/bcc">
          <Bcc />
        </Route>
        <Route exact path="/headquarters/:hqCode/bcc/:bccCode/societies">
          <Societies />
        </Route>
      </Switch>
    </>

  );
}

export default App;
