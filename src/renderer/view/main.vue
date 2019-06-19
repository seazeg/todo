<template>
  <layout-container>
    <layout-side>
      <layout-header class="side_bg"></layout-header>
      <div class="filter">
        <!-- 日期类型分类 -->
        <div class="item" :class="{'checked':item.checked}" v-for="(item,index) in menuList" :key="index"
          v-if="item.type=='all'" @click="showList(item)">
          <i class="iconfont" :class="item.icon"></i>
          <span class="name">{{item.name}}</span>
          <span class="num">{{item.num}}</span>
        </div>
      </div>
      <div class="hr"></div>
      <div class="task_type">
        <div class="title"><span>事务分类</span><i class="iconfont icon-jia"></i></div>
        <div class="list filter">
          <div class="item" :class="{'checked':item.checked}" v-for="(item,index) in menuList" :key="index"
            v-if="item.type=='taskbox'" @click="showList(item)">
            <i class="iconfont" :class="item.icon"></i>
            <span class="name">{{item.name}}</span>
            <span class="num">{{item.num}}</span>
          </div>
        </div>
      </div>
      <div class="hr"></div>
      <div class="filter">
        <div class="item" :class="{'checked':item.checked}" v-for="(item,index) in menuList" :key="index"
          v-if="item.type=='recover'" @click="showList(item)">
          <i class="iconfont" :class="item.icon"></i>
          <span class="name">{{item.name}}</span>
          <span class="num">{{item.num}}</span>
        </div>
      </div>
    </layout-side>
    <layout-main>
      <layout-header class="main_bg"></layout-header>
      <div class="add">
        <input type="text" placeholder="添加一个事务..." />
        <!-- <Select v-model="model1" class="date">
          <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select> -->
      </div>
      <div class="task_list">
        <transition name="component-fade" mode="out-in">
          <div class="group" v-show="!isOpen">
            <div class="item" v-for="(item,index) in todolist" v-if="item.status==0&&item.isShow" :key="index">
              <Checkbox v-model="item.checked">
                <span class="title">{{item.title}}</span>

              </Checkbox>
              <span class="tools"><i class="iconfont icon-bianji edit"></i>
                <i class="iconfont icon-shanchu remove" @click="remove"></i></span>
            </div>
          </div>
        </transition>
        <transition name="component-fade" mode="out-in">
          <div class="group" v-show="isOpen">
            <div class="item" v-for="(item,index) in todolist" v-if="item.status==1&&item.isShow" :key="index">
              <Checkbox v-model="item.checked" disabled>
                <span class="title">{{item.title}}</span>
              </Checkbox>
              <span class="tools"><i class="iconfont icon-bianji edit" @click="edit"></i>
                <i class="iconfont icon-shanchu remove" @click="remove"></i></span>
            </div>
          </div>
        </transition>
      </div>
      <div class="tash_over">
        <span @click="toggle"><i class="iconfont icon-wancheng" v-show="!isOpen"></i><i class="iconfont icon-shijian"
            v-show="isOpen"></i>{{toggleName}}</span>
      </div>
    </layout-main>
  </layout-container>
</template>

<script>
  export default {
    data() {
      return {
        isOpen: false,
        thisCategory: "",
        thisDateType: "今天",
        toggleName: "显示已经完成事务",
        menuList: [{
          name: "全部",
          num: 0,
          icon: "icon-shoucang",
          type: "all",
          checked: false
        }, {
          name: "废稿箱",
          num: 0,
          icon: "icon-shanchu",
          type: "recover",
          checked: false
        }, {
          name: "重要事务",
          num: 0,
          icon: "icon-wenjian",
          type: "taskbox",
          checked: false
        }, {
          name: "普通事务",
          num: 0,
          icon: "icon-wenjian",
          type: "taskbox",
          checked: false
        }],
        todolist: [{
          title: "普通事务普通事务", //名称
          category: "普通事务", //
          remindDate: "2019-6-18 18:00",
          dateType: "今天",
          status: 0,
          checked: false,
          isShow: false,
          isRecover: false
        }, {
          title: "废稿废稿废稿",
          category: "普通事务",
          remindDate: "2019-6-18 18:00",
          dateType: "今天",
          status: 0,
          checked: false,
          isShow: false,
          isRecover: true
        }, {
          title: "重要事务重要事务",
          category: "重要事务",
          remindDate: "2019-6-18 18:00",
          dateType: "今天",
          status: 0,
          checked: false,
          isShow: false,
          isRecover: false
        }, {
          title: "钉钉打卡",
          category: "重要事务",
          remindDate: "2019-6-18 18:00",
          dateType: "今天",
          status: 1,
          checked: true,
          isShow: false,
          isRecover: false
        }]
      }
    },
    methods: {
      showList(obj) {
        let todolist = this.todolist,
          menuList = this.menuList;
        this.resetStatus();
        switch (obj.type) {
          case 'all':
            obj.checked = true;
            for (let item of todolist) {
              if (!item.isRecover) {
                item.isShow = true;
              }
            }
            break;
          case 'recover':
            obj.checked = true;
            for (let item of todolist) {
              if (item.isRecover) {
                item.isShow = true;
              }
            }
            break;
          case 'taskbox':
            obj.checked = true;
            for (let item of todolist) {
              if (!item.isRecover && item.category == obj.name) {
                item.isShow = true;
              }
            }
            break;
          default:
            break;
        }

      },
      resetStatus() {
        for (let m of this.menuList) {
          m.checked = false;
        }
        for (let t of this.todolist) {
          t.isShow = false;
        }
      },
      toggle() {
        console.log(this.isOpen);
        this.isOpen = !this.isOpen;
        if (!this.isOpen) {
          this.toggleName = '显示已经完成事务'
        } else {
          this.toggleName = '显示待办事务'
        }
      },
      edit() {

      },
      remove() {
        this.$Message.success('事务删除成功');
      }
    },
    created() {
      this.showList(this.menuList[0]);
    }
  }
</script>

<style>

</style>