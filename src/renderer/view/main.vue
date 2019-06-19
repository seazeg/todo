<template>
  <layout-container>
    <layout-side>
      <layout-header class="side_bg"></layout-header>
      <div class="filter">
        <div class="item" :class="{'checked':item.checked}" v-for="(item,index) in menuList" :key="index"
          v-if="item.type=='all'" @click="showList(item)">
          <i class="iconfont" :class="item.icon"></i>
          <span class="name">{{item.name}}</span>
          <span class="num">{{item.num}}</span>
        </div>
      </div>
      <div class="hr"></div>
      <div class="task_type">
        <div class="title"><span>事务分类</span><i class="iconfont icon-jia" @click="isAddType = true"></i></div>
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
      <Modal class="addType" v-model="isAddType" fullscreen title="创建事务分类" ref="addType_modal" footer-hide>
        <div class="content">
          <input type="text" placeholder="事务分类名称..." :value="addType" ref="addType" />
          <span class="button" @click="addTypeBox">创建</span>
        </div>
      </Modal>
    </layout-side>
    <layout-main>
      <layout-header class="main_bg"></layout-header>
      <!-- 列表功能 -->
      <div class="tools">
        <div class="addTask">
          <i class="iconfont icon-jia"></i>
        </div>
        <input type="text" placeholder="搜索事务..." />
        <Select v-model="thisFilter" class="select">
          <Option v-for="(item,index) in filterList" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="task_list">
        <transition name="component-fade" mode="out-in">
          <div class="group" v-show="!isOpen">
            <div class="item" v-for="(item,index) in todolist" v-if="item.status==0&&item.isShow" :key="index">
              <Checkbox v-model="item.checked">
                <span class="title">{{item.title}}</span>
              </Checkbox>
              <span class="tools"><i class="iconfont icon-bianji edit" @click="editTask(item)"></i>
                <i class="iconfont icon-shanchu remove" @click="removeTask(item)"></i></span>
            </div>
          </div>
        </transition>
        <transition name="component-fade" mode="out-in">
          <div class="group" v-show="isOpen">
            <div class="item" v-for="(item,index) in todolist" v-if="item.status==1&&item.isShow" :key="index">
              <Checkbox v-model="item.checked" disabled>
                <span class="title">{{item.title}}</span>
              </Checkbox>
              <span class="tools"><i class="iconfont icon-bianji edit"></i>
                <i class="iconfont icon-shanchu remove" @click="removeTask(item)"></i></span>
            </div>
          </div>
        </transition>
        <Modal class="addType" v-model="isTaskType" fullscreen title="创建事务" ref="task_modal" footer-hide>
          <div class="content">
            <input type="text" placeholder="事务名称..." :value="taskType" ref="taskType" />
            <span class="button" @click="addTask">创建</span>
          </div>
        </Modal>
      </div>
      <div class="tash_over" v-if="!menuList[1].checked">
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
        isTaskType: false,
        taskType: "",
        isAddType: false,
        addType: "",
        isOpen: false,
        thisFilter: 2,
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
        }],
        filterList: [{
            value: 1,
            label: "循环"
          },
          {
            value: 2,
            label: '今天'
          },
          {
            value: 3,
            label: "本周"
          }
        ]
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
      updateNum() {
        let temp = {},
          todolist = this.todolist,
          menuList = this.menuList
        for (let n of todolist) {
          if (n.status == 0 && !n.isRecover) {
            if (!temp[n.category]) {
              temp[n.category] = 1
            } else {
              temp[n.category] = temp[n.category] + 1
            }
            temp['全部'] = (temp['全部'] || 0) + 1
          }

          if (n.isRecover) {
            temp['废稿箱'] = (temp['废稿箱'] || 0) + 1
          }

        }
        for (let m of menuList) {
          m.num = temp[m.name] || 0
        }

      },
      resetStatus() {
        for (let m of this.menuList) {
          m.checked = false;
        }
        for (let t of this.todolist) {
          t.isShow = false;
        }
        this.isOpen = false;
        this.toggleName = '显示已经完成事务';
      },
      addTypeBox() {
        this.menuList.push({
          name: this.$refs.addType.value,
          num: 0,
          icon: "icon-wenjian",
          type: "taskbox",
          checked: false
        });
        this.$refs.addType_modal.close()
      },
      toggle() {
        this.isOpen = !this.isOpen;
        if (!this.isOpen) {
          this.toggleName = '显示已经完成事务'
        } else {
          this.toggleName = '显示待办事务'
        }
      },
      addTask() {
   
      },
      editTask() {

      },
      removeTask(obj) {
        let todolist = this.todolist;
        if (!this.menuList[1].checked) {
          //移入废稿箱
          for (let item of todolist) {
            if (item.title === obj.title) {
              obj.isShow = false;
              obj.isRecover = true;
            }
          }
          this.$Message.success('事务已移入废稿箱');
        } else {
          //彻底删除
          for (let i = 0; i < todolist.length; i++) {
            if (todolist[i].title === obj.title) {
              todolist.splice(i, 1)
            }
          }
          this.$Message.success('事务删除成功');
        }
        this.updateNum();
      }
    },
    created() {
      this.showList(this.menuList[0]);
      this.updateNum()
    },
    mounted() {
      console.log(this.filterList);
    }
  }
</script>

<style>

</style>