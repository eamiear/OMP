<template>
  <div class="spicy-preview-wrapper">
    <div class="page">
      <div class="content" v-html="contentModel.content"></div>
      <div class="vote">
        <h3 class="vote-label">投票</h3>
        <p class="vote-desc">{{voteModel.title}}</p>
        <ul class="vote-list">
          <li class="vote-list-item" v-for="voteItem in voteModel.voteItemList">
            <div class="v-avatar">
              <div class="v-avatar-wrapper"  v-show="voteItem.image">
                <img :src="voteItem.image">
              </div>
            </div>
            <div class="vote-list-item-detail">
              <div class="vote-list-item-detail-desc">{{voteItem.title}}</div>
              <el-progress :text-inside="false" :show-text="true" :stroke-width="12" :percentage="voteItem.votes || 0" ></el-progress>
            </div>
          </li>
        </ul>
      </div>
      <div class="comments">
        <div class="comments-title">精选评论（5）</div>
        <ul class="comments-list">
          <li class="comments-list-item"  v-for="comment in commentsModel">
            <div class="v-avatar">
              <div class="v-avatar-wrapper" v-show="comment.image">
                <img :src="comment.image">
              </div>
            </div>
            <div class="comments-detail">
              <div class="comments-detail-header">
                <p class="nickname">{{comment.nickName}}</p>
                <span class="datetime">{{comment.createTime | dateFormat}}</span>
              </div>
              <p class="comments-detail-desc">{{comment.content}}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import * as SpicyLeader from '@/api/merchants/spicyleader'
  export default {
    name: 'spicy-preview',
    data () {
      return {
        contentModel: {
          content: ''
        },
        voteModel: {},
        commentsModel: [
          {
            image: 'http://placehold.it/100x100',
            nickName: '范德萨',
            content: '发的规范和规范会计贵航股份东方闪电疯疯癫癫防守打法多少岁方法',
            createTime: 1507721543000
          },
          {
            image: 'http://placehold.it/100x100',
            nickName: '范德萨',
            content: '发的规范和规范会计贵航股份东方闪电疯疯癫癫防守打法多少岁方法',
            createTime: 1507721543000
          },
          {
            image: 'http://placehold.it/100x100',
            nickName: '范德萨',
            content: '发的规范和规范会计贵航股份东方闪电疯疯癫癫防守打法多少岁方法',
            createTime: 1507721543000
          },
          {
            image: 'http://placehold.it/100x100',
            nickName: '范德萨',
            content: '发的规范和规范会计贵航股份东方闪电疯疯癫癫防守打法多少岁方法',
            createTime: 1507721543000
          },
          {
            image: 'http://placehold.it/100x100',
            nickName: '范德萨',
            content: '发的规范和规范会计贵航股份东方闪电疯疯癫癫防守打法多少岁方法',
            createTime: 1507721543000
          },
          {
            image: 'http://placehold.it/100x100',
            nickName: '范德萨',
            content: '发的规范和规范会计贵航股份东方闪电疯疯癫癫防守打法多少岁方法',
            createTime: 1507721543000
          }
        ]
      }
    },
    props: {
      magazineId: Number,
      voteId: Number
    },
    created () {
      this.initPage()
    },
    methods: {
      initPage () {
        this.getMagazine()
        this.getVotes()
        this.getComments()
      },
      getMagazine () {
        SpicyLeader.fetchSpicyLeaderById(this.magazineId).then(response => {
          this.contentModel = response.data.data
        })
      },
      getVotes () {
        SpicyLeader.fetchVotesByMagazineId(this.magazineId).then(response => {
          console.log('votes ', response)
          this.voteModel = response.data.data
        })
      },
      getComments () {
        // TODO
        // this.commentsModel = response.data.data
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  ul{
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .spicy-preview-wrapper {
    margin: 28px 65px;
    width: 375px;
    height: 667px;
    position: relative;
    background-color: #ccc;
    box-shadow: 0 0 8px 0 rgba(0,0,0,.3);
    z-index: 156;
    font-family: 'microsoft yahei';

    .page {
      width: 375px;
      padding: 10px;
      position: relative;
      margin: auto;
      height: 100%;
      background: #fff;
      overflow-y: auto;
    }
    .vote {
      background: #eee;
      padding: 10px 12px;

      .vote-label{
        font-size: 14px;
        color: #000;
        text-align: center;
      }
      .vote-desc{
        font-size: 13px;
      }
    }
    .v-avatar{
      display: inline-block;
      float: left;
      width: 40px;
      height: 40px;
      border: 1px double #999;
      margin: 0;
      border-radius: 50%;
      overflow: hidden;
    }
    .v-avatar-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
    }
    .vote-list {
      padding: 10px 0;
      .vote-list-item{
        margin-bottom: 20px;
      }
      .vote-list-item-detail {
        padding-left: 55px;

        .vote-list-item-detail-desc {
          font-size: 12px;
          margin-bottom: 4px;
        }
      }
      .el-progress__text{
        font-size: 14px!important;
        color: #999;
      }
    }

    .comments{
      margin-top: 20px;
      padding: 10px 12px;

      .comments-title{
        color: #999;
        font-size: 12px;
        padding:0 0 10px;
        border-bottom: 1px solid #eee;
      }

      .comments-list{
        .comments-list-item{
          padding: 10px 0 20px;
          margin-bottom: 5px;
          border-bottom: 1px solid #eee;
        }
        .comments-detail{
          padding-left: 55px;
        }
        .comments-detail .comments-detail-header{
          overflow: hidden;
          font-size: 12px;
          color: #bbb;
          margin-top: 5px;
        }
        .comments-detail-header .nickname{
          float: left;
          font-size: 14px;
          color: #333;
          margin-bottom: 0;
        }
        .comments-detail-header .datetime{
          float: right;
        }
        .comments-detail-desc{
          font-size: 12px;
          color: #777;
        }
      }
    }
  }
</style>
