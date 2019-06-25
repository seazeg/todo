<template>
  <layout-container>
    <layout-side>
      <layout-header class="side_bg">

      </layout-header>
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
        <div class="title"><span>事项分类</span><i class="iconfont icon-jia" @click="isAddType = true"></i></div>
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
      <div class="head_tools">
        <i class="iconfont icon-biaoqian" :class="{'selected':modeStatus}" @click="changeMode"></i>
      </div>

      <Modal class="addType" v-model="isAddType" fullscreen title="创建事项分类" ref="addType_modal" @on-cancel="addTypeClose"
        footer-hide>
        <div class="content">
          <input type="text" placeholder="事项分类名称..." v-model="addType" ref="addType" />
          <span class="button" @click="addTypeBox">创建</span>
        </div>
      </Modal>
    </layout-side>
    <layout-main>
      <layout-header class="main_bg">

      </layout-header>
      <!-- 列表功能 -->
      <div class="tools">
        <div class="addTask">
          <i class="iconfont icon-jia" @click="isTask=true"></i>
        </div>
        <!-- 搜索 -->
        <input type="text" placeholder="搜索事项..." @keyup="search" v-model="searchKey" />
        <!-- 条件筛选 -->
        <Select v-model="thisFilter" class="select" @on-change="filterSelect">
          <Option v-for="(item,index) in dateList" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        <!-- 创建弹层 -->
        <Modal class="addType" v-model="isTask" fullscreen title="创建事项" ref="addTask_modal" @on-cancel="addTaskClose"
          footer-hide>
          <div class="content mt">
            <input type="text" placeholder="事项名称..." v-model="taskName" />
            <div class="box">
              <DatePicker type="datetime" v-model="addDate" format="yyyy-MM-dd HH:mm" placeholder="选择提醒时间"
                class="datetime" placement="right" :options="dateOption" :clearable="false" :transfer="true"
                ref="datetime" @on-change="addDate=$event"></DatePicker>
              <Select v-model="thisTimes" class="select" placeholder="选择频率">
                <Option v-for="(item,index) in timesList" :value="item.value" :key="index">{{ item.label }}</Option>
              </Select>
              <Select v-model="thisTasktype" class="select" placeholder="选择分类">
                <Option v-for="(item,index) in tasktypeList" :value="item.value" :key="index">{{ item.label }}</Option>
              </Select>
            </div>
            <span class="button" @click="addTask">创建</span>
          </div>
        </Modal>
      </div>
      <!-- 列表内容 -->
      <div class="task_list">
        <transition name="component-fade" mode="out-in">
          <div class="group" v-show="!isOpen">
            <div class="item hover" v-for="(item,index) in todolist" v-if="item.status==0&&item.isShow" :key="index">
              <Checkbox v-model="item.checked" v-if="!menuList[1].checked" @on-change="finishTask(item)">
                <span class="title">{{item.title}}</span>
              </Checkbox>
              <span class="title left" v-else>{{item.title}}</span>
              <!-- <span class="date">{{$moment(item.remindDate).format('YYYY-MM-DD HH:mm')}}</span> -->
              <span class="tools">
                <i class="iconfont icon-bianji edit" @click="openEdit(item,index)" v-if="!menuList[1].checked"></i>
                <i class="iconfont icon-huifu revert" @click="revertTask(item)" v-else></i>
                <i class="iconfont icon-shanchu remove" @click="removeTask(item)"></i></span>
              <!-- 编辑弹层 -->
              <Modal class="addType" fullscreen title="编辑事项" :ref="'editTask_modal'+index" @on-cancel="editTaskClose"
                footer-hide>
                <div class="content mt">
                  <input type="text" placeholder="事项名称..." v-model="item.title" />
                  <div class="box">
                    <DatePicker type="datetime" v-model="item.remindDate" format="yyyy-MM-dd HH:mm" placeholder="选择提醒时间"
                      class="datetime" placement="right" :options="dateOption" :clearable="false" :transfer="true"
                      @on-change="item.remindDate=$event">
                    </DatePicker>
                    <Select v-model="item.times" class="select" placeholder="选择频率">
                      <Option v-for="(item,index) in timesList" :value="item.value" :key="index">{{ item.label }}
                      </Option>
                    </Select>
                    <Select v-model="item.category" class="select" placeholder="选择分类">
                      <Option v-for="(item,index) in tasktypeList" :value="item.value" :key="index">{{ item.label }}
                      </Option>
                    </Select>
                  </div>
                  <span class="button" @click="editTask(index)">修改</span>
                </div>
              </Modal>
            </div>
          </div>
        </transition>
        <transition name="component-fade" mode="out-in">
          <div class="group" v-show="isOpen">
            <div class="item" v-for="(item,index) in todolist" v-if="item.status==1&&item.isShow" :key="index">
              <Checkbox v-model="item.checked" disabled>
                <span class="title del">{{item.title}}</span>
              </Checkbox>
              <span class="tools">
                <i class="iconfont icon-huifu revert" @click="revertTask(item)"></i>
                <i class="iconfont icon-shanchu remove" @click="removeTask(item)"></i></span>
            </div>
          </div>
        </transition>

      </div>
      <div class="tash_over" v-if="!menuList[1].checked">
        <span @click="toggle"><i class="iconfont icon-wancheng" v-show="!isOpen"></i><i class="iconfont icon-shijian"
            v-show="isOpen"></i>{{toggleName}}</span>
      </div>
    </layout-main>
  </layout-container>
</template>

<script>
  import {
    ipcRenderer
  } from 'electron'
  import {
    local
  } from '../libs/local'
  let thisEditTask = {}
  export default {
    data() {
      return {
        modeStatus: false,
        searchKey: "",
        isTask: false,
        taskName: "",
        addDate: "",
        isAddType: false,
        addType: "",
        isOpen: false,
        thisFilter: "全部",
        thisTimes: "一次",
        thisTasktype: "",
        checkedTaskType: '',
        toggleName: "显示已经完成事项",
        tasktypeList: [],
        menuList: [],
        todolist: [],
        dateList: [{
          value: "全部",
          label: "全部"
        }, {
          value: "今天",
          label: "今天"
        }, {
          value: "本周",
          label: "本周"
        }],
        timesList: [{
          value: "10",
          label: "10分钟"
        }, {
          value: "30",
          label: "30分钟"
        }, {
          value: "60",
          label: "每小时"
        }, {
          value: "24",
          label: "每天"
        }, {
          value: "720",
          label: "每月"
        }],
        dateOption: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          },
          shortcuts: [
            {
              text: '1天后',
              value() {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 24 * 1000);
                return date;
              }
            }, {
              text: '1小时后',
              value() {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000);
                return date;
              }
            }, {
              text: '30分钟后',
              value() {
                const date = new Date();
                date.setTime(date.getTime() + 1800 * 1000);
                return date;
              }
            }, {
              text: '10分钟后',
              value() {
                const date = new Date();
                date.setTime(date.getTime() + 600 * 1000);
                return date;
              }
            }
          ]
        }
      }
    },
    methods: {
      changeMode() {
        this.modeStatus = !this.modeStatus
        ipcRenderer.send('modeStatus', this.modeStatus);
      },
      showList(obj) {
        let _this = this;
        let todolist = _this.todolist,
          menuList = _this.menuList;
        _this.resetStatus();
        _this.checkedTaskType = obj.name
        _this.thisFilter = '全部'
        _this.searchKey = "";
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
            this.$store.commit('setTaskNum', temp['全部']);
          }

          if (n.isRecover) {
            temp['废稿箱'] = (temp['废稿箱'] || 0) + 1
          }

        }
        for (let m of menuList) {
          m.num = temp[m.name] || 0
        }

      },
      //分类选择后的显示是否完成的重置
      resetStatus() {
        for (let m of this.menuList) {
          m.checked = false;
        }
        for (let t of this.todolist) {
          t.isShow = false;
        }
        this.isOpen = false;
        this.toggleName = '显示已经完成事项';
      },
      //弹层中分类同步
      syncTasktypeList() {
        for (let item of this.menuList) {
          if (item.type == 'taskbox') {
            this.tasktypeList.push({
              value: item.name,
              label: item.name
            })
          }
        }
      },
      //创建分类
      addTypeBox() {
        let _this = this
        _this.menuList.push({
          name: _this.addType,
          num: 0,
          icon: "icon-wenjian",
          type: "taskbox",
          checked: false
        });
        _this.$refs.addType_modal.close();
        _this.addType = "";
      },
      //关闭弹层回调，重置弹层内容成初始值
      addTypeClose() {
        let _this = this;
        _this.addType = "";
      },
      toggle() {
        this.isOpen = !this.isOpen;
        if (!this.isOpen) {
          this.toggleName = '显示已经完成事项'
        } else {
          this.toggleName = '显示待办事项'
        }
      },
      //创建任务
      addTask() {
        let _this = this
        let title = _this.taskName,
          date = _this.addDate,
          times = _this.thisTimes,
          category = _this.thisTasktype,
          isShow = false,
          taskType = _this.checkedTaskType

        if (taskType == '全部' || taskType == category) {
          isShow = true
        }
        _this.todolist.push({
          title: title,
          category: category,
          remindDate: date,
          times: times,
          status: 0,
          checked: false,
          isShow: isShow,
          isRecover: false
        })
        _this.updateNum();
        _this.$refs.addTask_modal.close();
        _this.taskName = "";
        _this.addDate = ""
        _this.thisTasktype = ""
      },
      //关闭弹层回调，重置弹层内容成初始值
      addTaskClose(e) {
        let _this = this;
        _this.taskName = "";
        _this.addDate = "";
        _this.thisTasktype = ""
      },
      //打开编辑弹层
      openEdit(obj, index) {
        let _this = this;
        let item = JSON.parse(JSON.stringify(obj));
        _this.$refs['editTask_modal' + index][0].visible = true;
        thisEditTask = {
          title: item.title,
          category: item.category,
          remindDate: _this.$moment(item.remindDate).format('YYYY-MM-DD HH:mm'),
          times: item.times,
          index: index
        }
      },
      //编辑任务
      editTask(index) {
        let _this = this;
        _this.$refs['editTask_modal' + index][0].visible = false;
        _this.updateNum();
      },
      //关闭弹层回调，重置弹层内容成初始值
      editTaskClose() {
        let item = thisEditTask;
        let _this = this;
        let todo = _this.todolist[item.index]
        _this.$set(todo, 'title', item.title);
        _this.$set(todo, 'category', item.category)
        _this.$set(todo, 'remindDate', item.remindDate)
        _this.$set(todo, 'times', item.times)
      },
      //删除任务
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
          this.$Message.success('事项已移入废稿箱');
        } else {
          //彻底删除
          for (let i = 0; i < todolist.length; i++) {
            if (todolist[i].title === obj.title) {
              todolist.splice(i, 1)
            }
          }
          this.$Message.success('事项删除成功');
        }
        this.updateNum();
      },
      //完成任务
      finishTask(obj) {
        if (obj.checked) {
          obj.status = 1;
          this.updateNum();
        }
      },
      //恢复任务
      revertTask(obj) {
        if (!this.menuList[1].checked) {
          //已完成任务的恢复
          obj.status = 0;
          obj.checked = false;
        } else {
          //废稿箱任务恢复
          obj.isRecover = false;
        }
        this.updateNum();
      },
      //即时搜索
      search() {
        let _this = this;
        let todolist = _this.todolist,
          searchKey = _this.searchKey,
          checkedTaskType = this.checkedTaskType,
          thisFilter = this.thisFilter

        for (let t of todolist) {
          t.isShow = false;
        }
        todolist.filter(function (obj) {
          if (searchKey) {
            if (checkedTaskType == '全部') {
              if (obj.title.includes(searchKey) && !obj.isRecover) {
                obj.isShow = true;
              }
            } else if (checkedTaskType == '废稿箱') {
              if (obj.title.includes(searchKey) && obj.isRecover) {
                obj.isShow = true;
              }
            } else {
              if (obj.title.includes(searchKey) && obj.category == checkedTaskType && !obj.isRecover) {
                obj.isShow = true;
              }
            }

          } else {
            if (checkedTaskType == '全部') {
              for (let t of todolist) {
                if (!t.isRecover && _this.toDateType(t.remindDate, thisFilter)) {
                  t.isShow = true;
                }
              }
            } else if (checkedTaskType == '废稿箱') {
              for (let t of todolist) {
                if (t.isRecover && _this.toDateType(t.remindDate, thisFilter)) {
                  t.isShow = true;
                }
              }
            } else {
              for (let t of todolist) {
                if (!t.isRecover && _this.toDateType(t.remindDate, thisFilter) && t.category == checkedTaskType) {
                  t.isShow = true;
                }
              }
            }
          }
        })
      },
      filterSelect(key) {
        let _this = this;
        let todolist = _this.todolist,
          checkedTaskType = this.checkedTaskType;

        for (let t of todolist) {
          t.isShow = false;
        }
        _this.searchKey = "";
        todolist.filter(function (obj) {
          if (key != '全部') {
            if (checkedTaskType == '全部') {
              if (!obj.isRecover && _this.toDateType(obj.remindDate, key)) {
                obj.isShow = true;
              }
            } else if (checkedTaskType == '废稿箱') {
              if (obj.isRecover && _this.toDateType(obj.remindDate, key)) {
                obj.isShow = true;
              }
            } else {
              if (!obj.isRecover && _this.toDateType(obj.remindDate, key) && obj.category == checkedTaskType) {
                obj.isShow = true;
              }
            }
          } else {
            if (checkedTaskType == '全部') {
              for (let t of todolist) {
                if (!t.isRecover) {
                  t.isShow = true;
                }
              }
            } else if (checkedTaskType == '废稿箱') {
              for (let t of todolist) {
                if (t.isRecover) {
                  t.isShow = true;
                }
              }
            } else {
              for (let t of todolist) {
                if (t.category == checkedTaskType && !t.isRecover) {
                  t.isShow = true;
                }
              }
            }
          }
        })
      },
      toDateType(date, key) {
        let moment = this.$moment;
        let res = false;
        if (key == '全部') {
          res = true
        } else if (key == '今天') {
          let thisDate = moment(date).format('YYYY-MM-DD');
          let nowDate = moment(new Date()).format('YYYY-MM-DD');
          if (thisDate == nowDate) {
            res = true;
          }
        } else if (key == '本周') {
          let thisTimestamp = moment(date).valueOf();
          let startWeekDay = moment().week(moment().week()).startOf('week').valueOf(),
            endWeekDay = moment().week(moment().week()).endOf('week').valueOf();
          if (thisTimestamp >= startWeekDay & thisTimestamp <= endWeekDay) {
            res = true;
          }
        } else {}

        return res;
      }
    },
    watch: {
      menuList: {
        handler: function (val, oldVal) {
          local.setData('menuList', this.menuList);
        },
        deep: true
      },
      todolist: {
        handler: function (val, oldVal) {
          local.setData('todolist', this.todolist);
        },
        deep: true
      }
    },
    created() {
      //本地数据同步
      this.menuList = JSON.parse(local.getData('menuList'));
      this.todolist = JSON.parse(local.getData('todolist'));
    },
    mounted() {
      this.showList(this.menuList[0])
      this.updateNum();
      this.syncTasktypeList();
    }
  }
</script>