import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Switch, Route, useHistory, useParams } from 'react-router-dom'
import { Row, Col, Typography, Button, Table, Menu, Select, Avatar, Tag, Skeleton } from 'antd'
import { AiOutlinePlus, AiOutlineHeart, AiFillStar } from 'react-icons/ai'
import { FaArrowAltCircleUp, FaArrowAltCircleDown } from 'react-icons/fa'

import {
  selectAnime,
  getAnime,
  getCharactersAndStaff,
  getReviews,
  getArticles,
  getTopics,
  getRecommendations
} from 'store/anime'
import {
  Reference
} from 'interfaces/anime'
import {
  Overview,
  Characters,
  Staff,
  Reviews,
  News,
  Forums,
  Recommendations
} from './views'
import './style.less'

const { Title, Text, Paragraph, Link } = Typography
const { Option } = Select

const infoColumnKeys = [
  'type',
  'episodes',
  'status',
  'aired',
  'premiered',
  'broadcast',
  'producers',
  'licensors',
  'studios',
  'source',
  'genres',
  'duration',
  'rating'
]

const infoColumns = infoColumnKeys.map(key => (
  {
    title: `${key.charAt(0).toUpperCase()}${key.slice(1)}`,
    dataIndex: key,
    key,
  }
));

const Anime = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const {id, menu} = useParams<{id: string, menu: string}>()

  const anime = useSelector(selectAnime)

  useEffect(() => {
    dispatch(getAnime("1"))
    dispatch(getCharactersAndStaff("1"))
    dispatch(getReviews("1"))
    dispatch(getArticles("1"))
    dispatch(getTopics("1"))
    dispatch(getRecommendations("1"))
  }, [dispatch])
  useEffect(() => {
    console.log(anime)
  }, [anime])

  const generateReferenceText = (references: Reference[]) => (<>
    {references.map((reference, i) => (
      <>
      <Link type='warning' onClick={() => window.open(reference.url, '_blank')}>
        {reference.name}
      </Link>
      {i < references.length - 1 && ', '}
      </>
    ))}
  </>)

  // convert anime object to table dataSource format
  const getAnimeInfoDataSource = () => {
    if(!anime?.data) return {}
    const { aired, producers, licensors, studios, genres } = anime.data
    return {
      ...anime.data,
      aired: aired.string,
      producers: generateReferenceText(producers),
      licensors: generateReferenceText(licensors),
      studios: generateReferenceText(studios),
      genres: generateReferenceText(genres)
    }
  }

  return (
    <div>
      <div className='anime-banner-image-container'>
        <div className='anime-banner-image-text-container content-container py-4'>
          <Row wrap={false}>
            <Col flex='282px'/>
            <Col flex='auto'>
              <Row gutter={32} wrap={false} align='bottom' justify='space-between'>
                <Col>
                  {anime.loading ? (
                    <>
                      <Skeleton.Button active className='anime-title-skeleton mb-1'/>
                      <Skeleton.Button active className='anime-subtitle-skeleton'/>
                    </>
                  ) : (
                    <>
                      <Title type='secondary' ellipsis={{rows: 1, tooltip: true}} className='mb-1'>
                        {anime.data?.title_english}
                      </Title>
                      <Paragraph type='secondary' ellipsis={{rows: 4, tooltip: true}} className='typography-h4'>
                        {anime.data?.title}
                      </Paragraph>
                    </>
                  )}
                </Col>
                <Col>
                  <Row wrap={false} gutter={16}>
                    <Col>
                      <Button ghost shape='circle'>
                        <AiOutlinePlus/>
                      </Button>
                    </Col>
                    <Col>
                      <Button ghost shape='circle'>
                        <AiOutlineHeart/>
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <img src={anime.data?.image_url} alt='' className='anime-banner-image'/>
      </div>
      <div className='anime-banner-info-container py-4'>
        <div className='content-container'>
          <Row wrap={false} gutter={50} className='mb-4'>
            <Col flex='282px'>
              {anime.loading
              ? <Skeleton.Button active className='anime-banner-info-image-skeleton'/>
              : <img src={anime.data?.image_url} alt='' className='anime-banner-info-image'/>
              }
            </Col>
            <Col flex='auto'>
              <Row justify='space-between' className='mb-2'>
                <Col>
                  <Title level={4} type='secondary'>Synopsis</Title>
                </Col>
                {!anime.loading && (
                  <Col>
                    <Row gutter={16}>
                      <Col>
                        <Text type='secondary' strong>Ranked: </Text><Text type='secondary'>#{anime.data?.rank}</Text>
                      </Col>
                      <Col>
                        <Text type='secondary' strong>Popularity: </Text><Text type='secondary'>#{anime.data?.popularity}</Text>
                      </Col>
                      <Col>
                        <Text type='secondary' strong>Members: </Text><Text type='secondary'>{anime.data?.members.toLocaleString()}</Text>
                      </Col>
                    </Row>
                  </Col>
                )}
              </Row>
              {anime.loading
              ? <Skeleton active paragraph={{rows: 1}}/>
              : <Paragraph ellipsis={{rows: 4, expandable: true, symbol: 'More'}} type='secondary'>
                  {anime.data?.synopsis}
                </Paragraph>
              }
            </Col>
          </Row>
          <Row gutter={24} wrap={false}>
            <Col span={3}>
              <div className='anime-banner-info-score-container centered-flex p-1'>
                <Row align='middle' className='row-vertical'>
                  <Col>
                    <Text strong type='secondary'>SCORE</Text>
                  </Col>
                  <Col>
                    <Text strong type='secondary' className='anime-banner-info-score'>{anime.data?.score}</Text>
                  </Col>
                  <Col>
                    <Text type='secondary'>{anime.data?.scored_by.toLocaleString()} users</Text>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col flex='auto'>
              <Table loading={anime.loading} dataSource={[getAnimeInfoDataSource()]} columns={infoColumns} pagination={false} className='anime-banner-info-table overflow-scroll' />
            </Col>
          </Row>
        </div>
      </div>
      <div className='centered-flex pt-4 pb-5'>
        <div className='content-container'>
          <Menu mode='horizontal' selectedKeys={[menu || 'overview']} className='anime-menu mb-5' >
            <Menu.Item key='overview' onClick={() => history.push(`/anime/${id}`)}>OVERVIEW</Menu.Item>
            <Menu.Item key='characters' onClick={() => history.push(`/anime/${id}/characters`)}>CHARACTERS</Menu.Item>
            <Menu.Item key='staff' onClick={() => history.push(`/anime/${id}/staff`)}>STAFF</Menu.Item>
            <Menu.Item key='reviews' onClick={() => history.push(`/anime/${id}/reviews`)}>REVIEWS</Menu.Item>
            <Menu.Item key='news' onClick={() => history.push(`/anime/${id}/news`)}>NEWS</Menu.Item>
            <Menu.Item key='forums' onClick={() => history.push(`/anime/${id}/forums`)}>FORUMS</Menu.Item>
            <Menu.Item key='recommendations' onClick={() => history.push(`/anime/${id}/recommendations`)}>RECOMMENDATIONS</Menu.Item>
          </Menu>
          <Switch>
            <Route exact path='/anime/:id'>
              <Overview/>
            </Route>
            <Route exact path='/anime/:id/characters'>
              <Characters/>
            </Route>
            <Route exact path='/anime/:id/staff'>
              <Staff/>
            </Route>
            <Route exact path='/anime/:id/reviews'>
              <Reviews/>
            </Route>
            <Route exact path='/anime/:id/news'>
              <News/>
            </Route>
            <Route exact path='/anime/:id/forums'>
              <Forums/>
            </Route>
            <Route exact path='/anime/:id/recommendations'>
              <Recommendations/>
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  ) 
}

export default Anime;