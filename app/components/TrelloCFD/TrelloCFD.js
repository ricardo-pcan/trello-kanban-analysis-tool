import {button} from '@cycle/dom';
import {Observable} from 'rx';
import R from 'ramda';

import {parseActions} from './actions';
import {parseToGraph} from './graph';

import {today, filterBetweenDates} from '../../utils/date';

function TrelloCFD (
  {
    DOM,
    actions$,
    lists$,
    displayedLists$,
    dates$,
    props$
  }
) {
  const clicks$ = DOM
    .select( '.button' )
    .events( 'click' )
    .startWith( false );

  const vtree$ = props$.map( ( props ) => button(
    { className: R.join( ' ', R.concat( [ 'button' ], props.classNames ) ) },
    props.label )
  );

  const parsedActions$ = Observable.combineLatest(
    dates$,
    lists$,
    actions$,
    ( { startDate, endDate }, lists, actions ) => R.compose(
      filterBetweenDates( startDate, endDate ),
      parseActions( today, lists )
    )( actions )
  );

  return {
    DOM: vtree$,
    Trello: clicks$,
    Graph: Observable.combineLatest(
      displayedLists$,
      parsedActions$,
      parseToGraph
    )
  };
}

export default TrelloCFD;
