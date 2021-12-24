import React, {useEffect, useState} from 'react';
import {ReactSVG} from "react-svg";
import NumberFormat from "react-number-format";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Container} from "../../../components/grid";
import {Col, Row} from "react-grid-system";
import Title from "../../../components/title";
import Text from "../../../components/text";
import Content from "../../../components/content";
import {BaseLineChart} from "../../../components/base-chart";
import BaseSelect from "../../../components/base-select";
import Growth from "../../../components/growth";
import BaseButton from "../../../components/base-button";
import BaseProgress from "../../../components/base-progress";
import chevronIcon from "../../../assets/images/icons/chevron.svg";
import checkLightIcon from "../../../assets/images/icons/check-light.svg";
import checkFullIcon from "../../../assets/images/icons/check-full.svg";
import Flex from "../../../components/flex";
import {get, head, includes, isEqual, round} from "lodash";
import Actions from "../Actions";
import AccountActions from "../../accounts/Actions";
import ContentLoader from "../../../components/loader/ContentLoader";
import HasAccess from "../../../services/auth/HasAccess";
import Normalizer from "../../../services/normalizer";
import CountryScheme from "../../../schema/CountryScheme";

const HomeContainer = ({history, user, getDashboardDataDispatch, dashboard, isFetched,getCountryListDispatch,countries,entities}) => {

        let [selectedCountries, setSelectedCountries] = useState([]);
        let [type, setType] = useState('month');
        const [lines, setLines] = useState([]);

        useEffect(() => {
            setLines(selectedCountries.map(({label}) => label));
        }, [selectedCountries])
        useEffect(() => {
            getCountryListDispatch();
        }, []);

        useEffect(() => {
            getDashboardDataDispatch({type});
        }, [type]);

        useEffect(() => {
            setLines(get(head(get(dashboard,'topUpVolumes',{})),'values',[]).map(({country}) => country))
        },[dashboard]);

        countries = Normalizer.Denormalize(countries, [CountryScheme], entities).map(({id, name}) => ({
            value: id,
            label: name
        }));

        return (
            <>{isFetched ?
                <Container width={'80%'}>
                    <Row className={'mb-24'}>
                        <Col xs={12}>
                            <Title padding={'0 0 0 25px'}>Dashboard</Title>
                            <Text padding={'0 0 0 25px'} gray>Good to see you again, {get(user, 'firstName', '')}</Text>
                        </Col>
                    </Row>
                    <Row className={'mb-24'}>
                        <Col xs={12}>
                            <Content rounded>
                                <Row gutterWidth={60}>
                                    <Col xs={9}>
                                        <Row className={'mb-16'}>
                                        <Col xs={5}>
                                            <Text xl dark medium>Top-up Volume </Text>
                                        </Col>
                                        <Col xs={7}>
                                            <Flex justify={'flex-end'}>
                                                <BaseSelect
                                                    defaultValue={countries.filter(country => includes(get(head(get(dashboard, 'topUpVolumes')), 'values').map(({country}) => country), get(country, 'label')))}
                                                    handleChange={(item) => setSelectedCountries(item)} width={'600px'}
                                                    placeholder={'Choose countries '} options={countries}
                                                    isMulti/><BaseSelect
                                                margin={'0 0 0 8px'}
                                                width={'125px'}
                                                defaultValue={type}
                                                options={[{value: 'month', label: 'Month'}, {
                                                    value: 'year',
                                                    label: 'Year'
                                                }]}
                                                placeholder={'Select'}
                                                handleChange={({value}) => setType(value)}/>
                                            </Flex>

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <BaseLineChart
                                                lines={lines}
                                                data={get(dashboard, 'topUpVolumes', [])}
                                                date={type}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={3}>
                                    <Row className={'mt-48'}>
                                        <Col xs={12}>
                                            <Title margin={'0 0 15px'}>$<NumberFormat displayType={'text'}
                                                                                      thousandSeparator={','}
                                                                                      value={round(get(dashboard, 'amountTopUps', 0), 2)}/></Title>
                                        </Col>
                                    </Row>
                                    <Row className={'mb-24'}>
                                        <Col xs={12}>
                                            <Flex><Text gray margin={'0 8px 0px 0'}>Top-ups this
                                                month</Text><Growth
                                                increase={get(dashboard, 'up', false)} decrease={!get(dashboard, 'up', false) && get(dashboard, 'amountTopUpsPercent', 0) != 0}>{round(get(dashboard, 'amountTopUpsPercent', 0), 2)}%</Growth></Flex>
                                        </Col>
                                    </Row>
                                    <Row className={'mb-48'}>
                                        <Col xs={12}>
                                            <BaseButton outlined dark handleClick={() => history.push('/txns')}>All
                                                top-up Summary</BaseButton>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <Title margin={'0 0 8px 0'}>{get(dashboard, 'allCountryCount', 0)}</Title>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12}>
                                            <BaseButton outlined dark handleClick={() => history.push('/txns')}>All
                                                Countries</BaseButton>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Content>
                    </Col>
                </Row>

                <Row>
                    <Col xs={6}>
                        <Content rounded>
                            <Row align={'center'} className={'mb-16'}>
                                <Col xs={6}><Text xl dark medium>Users</Text></Col>
                                <Col xs={6} className={'text-right'}>
                                    <HasAccess>
                                        {({userCan,permissions}) => userCan(permissions,'GET_STAFF_LIST') && <BaseButton outlined dark handleClick={() => history.push('/users')}>All
                                                Users
                                                Data</BaseButton>
                                        }
                                    </HasAccess>
                                </Col>
                            </Row>
                            <Row className={'mb-24'}>
                                <Col xs={6}>
                                    <Title><NumberFormat displayType={'text'} thousandSeparator={','}
                                                         value={round(get(dashboard, 'userData.activeUsersCount', 0), 2)}/></Title>
                                    <Text gray>Active Users</Text>
                                </Col>
                                <Col xs={6}>
                                    <Title><NumberFormat displayType={'text'} thousandSeparator={','}
                                                         value={round(get(dashboard, 'userData.inActiveUsersCount', 0), 2)}/></Title>
                                    <Text gray>Inactive Users</Text>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={6}>
                                    <Title><NumberFormat displayType={'text'} thousandSeparator={','}
                                                         value={round(get(dashboard, 'userData.newDailyUserCount', 0), 2)}/></Title>
                                    <Text gray>New Users (Daily)</Text>
                                </Col>
                                <Col xs={6}>
                                    <Title><NumberFormat displayType={'text'} thousandSeparator={','}
                                                         value={round(get(dashboard, 'userData.newMonthlyUserCount', 0), 2)}/></Title>
                                    <Text gray>New Users (Monthly)</Text>
                                </Col>
                            </Row>
                        </Content>
                    </Col>
                    <Col xs={6}>
                        <Content rounded>
                            <Row align={'center'} className={'mb-16'}>
                                <Col xs={8}> <Text xl dark medium>Last Sent Push Notifications</Text></Col>
                                <Col xs={4} className={'text-right'}><HasAccess>
                                    {({userCan,permissions}) => userCan(permissions,'GET_NOTIFICATION_LIST') && <BaseButton
                                        handleClick={() => history.push('/users/notifications')}
                                        outlined dark width={'80px'}>See All</BaseButton>
                                    }</HasAccess></Col>

                            </Row>
                            {get(dashboard, 'notificationData', []).map((notification, index) => <div key={index}><Row
                                align={'center'}>
                                <Col xs={2}>
                                    <Flex justify={'center'}>
                                        <BaseProgress percentage={get(notification, 'openedPercent', 0)}/>
                                    </Flex>
                                </Col>
                                <Col xs={10}>
                                    <Flex className={'mb-8'}>
                                        <ReactSVG src={chevronIcon}
                                                  className={'check-icon arrow'}/><Text
                                        gray> {get(notification, 'title', '')}</Text>
                                    </Flex>
                                    <Flex className={'mb-8'}><ReactSVG className={'check-icon'}
                                                                       src={checkLightIcon}/><Text
                                        gray> Delivered: <NumberFormat displayType={'text'} thousandSeparator={','}
                                                                       value={round(get(notification, 'deliveredCount', 0), 2)}/></Text></Flex>
                                    <Flex><ReactSVG className={'check-icon'} src={checkFullIcon}/><Text
                                        gray> Opened: <NumberFormat displayType={'text'} thousandSeparator={','}
                                                                    value={round(get(notification, 'openedCount', 0), 2)}/></Text></Flex>
                                </Col>
                            </Row>
                                {!isEqual(index + 1, get(dashboard, 'notificationData', []).length) &&
                                <Row className={'mt-24 mb-24'}>
                                    <Col xs={12}>
                                        <hr className={'horizontal-line'}/>
                                    </Col>
                                </Row>}
                            </div>)

                            }

                        </Content>
                    </Col>

                </Row>
            </Container> : <ContentLoader height={'80vh'}/>
        }
        </>
    );
}
;
const mapStateToProps = (state) =>
{
    return {
        entities: get(state, 'normalizer.entities', {}),
        user: get(state, 'auth.user', {}),
        dashboard: get(state, 'normalizer.data.dashboard-data.result', {}),
        isFetched: get(state, 'normalizer.data.dashboard-data.isFetched', false),
        countries: get(state, 'normalizer.data.country-list.result', []),
    }
}
const mapDispatchToProps = (dispatch) =>
{
    return {
        getDashboardDataDispatch: ({type}) => dispatch({type: Actions.GET_DASHBOARD_DATA.REQUEST, payload: {type}}),
        getCountryListDispatch: () => dispatch({type: AccountActions.GET_COUNTRY_LIST.REQUEST, payload: {params: {}}})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HomeContainer));
