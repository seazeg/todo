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
      <Modal class="addType" v-model="isAddType" fullscreen title="创建事务分类" ref="addType_modal" @on-cancel="addTypeClose"
        footer-hide>
        <div class="content">
          <input type="text" placeholder="事务分类名称..." v-model="addType" ref="addType" />
          <span class="button" @click="addTypeBox">创建</span>
        </div>
      </Modal>
    </layout-side>
    <layout-main>
      <layout-header class="main_bg"></layout-header>
      <!-- 列表功能 -->
      <div class="tools">
        <div class="addTask">
          <i class="iconfont icon-jia" @click="isTask=true"></i>
        </div>
        <!-- 搜索 -->
        <input type="text" placeholder="搜索事务..." />
        <!-- 条件筛选 -->
        <Select v-model="thisFilter" class="select">
          <Option v-for="(item,index) in filterList" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
        <!-- 创建弹层 -->
        <Modal class="addType" v-model="isTask" fullscreen title="创建事务" ref="addTask_modal" @on-cancel="addTaskClose"
          footer-hide>
          <div class="content mt">
            <input type="text" placeholder="事务名称..." v-model="taskName" />
            <div class="box">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择提醒时间" class="datetime"
                placement="right" :options="dateOption" :clearable="false" :transfer="true" ref="datetime"></DatePicker>
              <Select v-model="thisTimes" class="select">
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
            <div class="item" v-for="(item,index) in todolist" v-if="item.status==0&&item.isShow" :key="index">
              <Checkbox v-model="item.checked" v-if="!menuList[1].checked">
                <span class="title">{{item.title}}</span>
              </Checkbox>
              <span class="title left" v-else>{{item.title}}</span>
              <span class="tools">
                <i class="iconfont icon-bianji edit" @click="openEdit(item,index)" v-if="!menuList[1].checked"></i>
                <i class="iconfont icon-huifu revert" @click="revertTask(item)" v-else></i>
                <i class="iconfont icon-shanchu remove" @click="removeTask(item)"></i></span>
              <!-- 编辑弹层 -->
              <Modal class="addType" fullscreen title="编辑事务" :ref="'editTask_modal'+index" @on-cancel="editTaskClose"
                footer-hide>
                <div class="content mt">
                  <input type="text" placeholder="事务名称..." v-model="item.title" />
                  <div class="box">
                    <DatePicker type="datetime" v-model="item.remindDate" format="yyyy-MM-dd HH:mm" placeholder="选择提醒时间"
                      class="datetime" placement="right" :options="dateOption" :clearable="false" :transfer="true"
                      ref="datetime">
                    </DatePicker>
                    <Select v-model="item.times" class="select">
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
                <span class="title">{{item.title}}</span>
              </Checkbox>
              <span class="tools"><i class="iconfont icon-bianji edit"></i>
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
    setTimeout
  } from 'timers';
  let thisEditTask = {}
  export default {
    data() {
      return {
        isTask: false,
        taskName: "",
        isAddType: false,
        addType: "",
        isOpen: false,
        thisFilter: "今天",
        thisTimes: "一次",
        thisTasktype: "",
        checkedTaskType: '',
        toggleName: "显示已经完成事务",
        tasktypeList: [],
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
          times: "一次",
          status: 0,
          checked: false,
          isShow: false,
          isRecover: false
        }, {
          title: "废稿废稿废稿",
          category: "普通事务",
          remindDate: "2019-6-18 18:00",
          times: "一次",
          status: 0,
          checked: false,
          isShow: false,
          isRecover: true
        }, {
          title: "废稿废稿废稿",
          category: "普通事务",
          remindDate: "2019-6-18 18:00",
          times: "一次",
          status: 0,
          checked: false,
          isShow: false,
          isRecover: true
        }, {
          title: "重要事务重要事务",
          category: "重要事务",
          remindDate: "2019-6-18 18:00",
          times: "循环",
          status: 0,
          checked: false,
          isShow: false,
          isRecover: false
        }, {
          title: "重要事务重要事务",
          category: "重要事务",
          remindDate: "2019-6-18 18:00",
          times: "循环",
          status: 0,
          checked: false,
          isShow: false,
          isRecover: false
        }, {
          title: "钉钉打卡",
          category: "重要事务",
          remindDate: "2019-6-18 18:00",
          times: "循环",
          status: 1,
          checked: true,
          isShow: false,
          isRecover: false
        }],
        filterList: [{
            value: "循环",
            label: "循环"
          },
          {
            value: "一次",
            label: "一次"
          },
          {
            value: "今天",
            label: "今天"
          },
          {
            value: "本周",
            label: "本周"
          }
        ],
        timesList: [{
            value: "循环",
            label: "循环"
          },
          {
            value: "一次",
            label: "一次"
          }
        ],
        dateOption: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          },
          shortcuts: [{
              text: '今天',
              value() {
                return new Date();
              },
              // onClick: (picker) => {
              //   this.$Message.info('Click today');
              // }
            },
            {
              text: '明天',
              value() {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                return date;
              },
              onClick: (picker) => {
                this.$Message.info('Click yesterday');
              }
            },
            {
              text: '一周',
              value() {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                return date;
              },
              onClick: (picker) => {
                this.$Message.info('Click a week ago');
              }
            }
          ]
        }
      }
    },
    methods: {
      showList(obj) {
        let todolist = this.todolist,
          menuList = this.menuList;
        this.resetStatus();
        this.checkedTaskType = obj.name
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
      addTypeClose() {
        _this.addType = "";
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
        let _this = this
        let title = _this.taskName,
          date = _this.$refs.datetime.visualValue,
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
        _this.$refs.datetime.handleClear()
      },
      addTaskClose(e) {
        _this.taskName = "";
        _this.$refs.datetime.handleClear()
      },
      openEdit(obj, index) {
        let _this = this;
        let item = JSON.parse(JSON.stringify(obj));
        _this.$refs['editTask_modal' + index][0].visible = true;
        thisEditTask = {
          title: item.title,
          category: item.category,
          remindDate: item.remindDate,
          times: item.times,
          index: index
        }

      },
      editTask(index) {
        let _this = this;
        _this.$refs['editTask_modal' + index][0].visible = false;
      },
      editTaskClose() {
        console.log(thisEditTask);
        let item = thisEditTask;
        let _this = this;
        let todo = _this.todolist[item.index]
        _this.$set(todo, 'title', item.title);
        _this.$set(todo, 'category', item.category)
        _this.$set(todo, 'remindDate', item.remindDate)
        _this.$set(todo, 'times', item.times)
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
      this.showList(this.menuList[0])
      this.updateNum();
      this.syncTasktypeList();
    },
    mounted() {
      console.log(this.checkedTaskType);
    }
  }
</script>

<style>

</style>