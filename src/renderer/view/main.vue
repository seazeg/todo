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
      <Modal class="addType" v-model="isAddType" fullscreen title="创建事项分类" ref="addType_modal"
        @on-cancel="addTypeClose('typeValidate')" footer-hide>
        <div class="content">
          <Form ref="typeValidate" :model="typeValidate" :rules="typeRuleValidate">
            <FormItem prop="addType" :show-message="false">
              <Input placeholder="事项分类名称..." v-model="typeValidate.addType" ref="addType" />
            </FormItem>
            <span class="button" @click="addTypeBox('typeValidate')">创建</span>
          </Form>
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
        <Modal class="addType" v-model="isTask" fullscreen title="创建事项" ref="addTask_modal"
          @on-cancel="addTaskClose('listValidate')" footer-hide>
          <div class="content mt">
            <Form ref="listValidate" :model="listValidate" :rules="listRuleValidate">
              <FormItem prop="taskName" :show-message="false">
                <Input placeholder="事项名称..." v-model="listValidate.taskName" />
              </FormItem>
              <div class="box">
                <Row>
                  <Col span="12">
                  <FormItem prop="addDate" :show-message="false">
                    <DatePicker type="datetime" v-model="listValidate.addDate" format="yyyy-MM-dd HH:mm"
                      placeholder="选择提醒时间" class="datetime" placement="right" :options="dateOption" :clearable="false"
                      :transfer="true" ref="datetime" :editable="false"></DatePicker>
                  </FormItem>
                  </Col>
                  <Col span="6">
                  <FormItem prop="thisTimes" :show-message="false">
                    <Select v-model="listValidate.thisTimes" class="select" placeholder="选择频率">
                      <Option v-for="(item,index) in timesList" :value="item.value" :key="index">{{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                  </Col>
                  <Col span="6">
                  <FormItem prop="thisTasktype" :show-message="false">
                    <Select v-model="listValidate.thisTasktype" class="select" placeholder="选择分类">
                      <Option v-for="(item,index) in tasktypeList" :value="item.value" :key="index">{{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                  </Col>
                </Row>
              </div>
              <span class="button" @click="addTask('listValidate')">创建</span>
            </Form>
          </div>
        </Modal>
      </div>
      <!-- 列表内容 -->
      <div class="task_list">
        <transition name="component-fade" mode="out-in">
          <div class="group" v-show="!isOpen">
            <div class="item hover" v-for="(item,index) in todolist" v-if="item.status==0&&item.isShow"
              v-dragging="{ item: item, list: todolist, group: 'item' }" :key="index">
              <Checkbox v-model="item.checked" v-if="!menuList[1].checked" @on-change="finishTask(item)">
                <span class="title">{{item.title}}</span>
              </Checkbox>
              <span class="title left" v-if="menuList[1].checked">{{item.title}}</span>
              <span v-if="!menuList[1].checked"
                class="date">{{$moment(new Date()).isSame(item.remindDate,'day')?$moment(item.remindDate).format('HH:mm'):$moment(item.remindDate).format('MM-DD')}}</span>
              <span class="tools">
                <i class="iconfont icon-bianji edit" @click="openEdit(item,index)" v-if="!menuList[1].checked"></i>
                <i class="iconfont icon-huifu revert" @click="revertTask(item)" v-else></i>
                <i class="iconfont icon-shanchu remove" @click="removeTask(item)"></i></span>
              <!-- 编辑弹层 -->

              <Modal class="addType" fullscreen title="编辑事项" :ref="'editTask_modal'+index" @on-cancel="editTaskClose"
                footer-hide v-if="!item.isRecover&&item.status==0">
                <div class="content mt">
                  <Form :ref="'editValidate'+index" :model="item" :rules="editRuleValidate">
                    <FormItem prop="title" :show-message="false">
                      <Input type="text" placeholder="事项名称..." v-model="item.title" />
                    </FormItem>
                    <div class="box">
                      <Row>
                        <Col span="12">
                        <FormItem prop="remindDate" :show-message="false">
                          <DatePicker type="datetime" v-model="item.remindDate" format="yyyy-MM-dd HH:mm"
                            placeholder="选择提醒时间" class="datetime" placement="right" :options="dateOption"
                            :clearable="false" :transfer="true" :editable="false">
                          </DatePicker>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem prop="times" :show-message="false">
                          <Select v-model="item.times" class="select" placeholder="选择频率">
                            <Option v-for="(item,index) in timesList" :value="item.value" :key="index">{{ item.label }}
                            </Option>
                          </Select>
                        </FormItem>
                        </Col>
                        <Col span="6">
                        <FormItem prop="category" :show-message="false">
                          <Select v-model="item.category" class="select" placeholder="选择分类">
                            <Option v-for="(item,index) in tasktypeList" :value="item.value" :key="index">
                              {{ item.label }}
                            </Option>
                          </Select>
                        </FormItem>
                        </Col>
                      </Row>
                    </div>
                    <span class="button" @click="editTask(index,'editValidate' + index,item)">修改</span>
                  </Form>
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
              <span
                class="date">{{$moment(new Date()).isSame(item.remindDate,'day')?$moment(item.remindDate).format('HH:mm'):$moment(item.remindDate).format('MM-DD')}}</span>
              <span class="tools">
                <i class="iconfont icon-huifu revert" @click="revertTask(item)"></i>
                <!-- <i class="iconfont icon-shanchu remove" @click="removeTask(item)"></i> -->
              </span>
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
  import {
    guid
  } from '../libs/utils'
  let thisEditTask = {}
  export default {
    data() {
      return {
        selectTime:"",
        TASKID:"",
        typeValidate: {
          addType: ""
        },
        typeRuleValidate: {
          addType: [{
            required: true
          }]
        },
        listValidate: {
          taskName: "",
          addDate: "",
          thisTimes: "",
          thisTasktype: "",
        },
        listRuleValidate: {
          taskName: [{
            required: true
          }],
          addDate: [{
            required: true,
            type: 'date'
          }],
          thisTimes: [{
            required: true
          }],
          thisTasktype: [{
            required: true
          }]
        },
        editRuleValidate: {
          title: [{
            required: true
          }]
        },
        modeStatus: false,
        searchKey: "",
        isTask: false,
        isAddType: false,
        isOpen: false,
        thisFilter: "全部",
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
          value:"one",
          label:"单次"
        },{
          value: "work",
          label: "工作日"
        },{
          value: "day",
          label: "每天"
        }, {
          value: "week",
          label: "每周"
        }, {
          value: "month",
          label: "每月"
        }],
        postTimeList:[{
          value: 600 * 1000,
          label: "10分钟"
        }, {
          value: 1800 * 1000,
          label: "30分钟"
        }, {
          value: 3600 * 1000,
          label: "1小时"
        }, {
          value: 3600 * 24 * 1000,
          label: "1天"
        }],
        dateOption: {
          disabledDate(date) {
            return date && date.valueOf() < Date.now() - 86400000;
          },
          shortcuts: [{
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
          }, {
            text: '1分钟后',
            value() {
              const date = new Date();
              date.setTime(date.getTime() + 60 * 1000);
              return date;
            }
          }]
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
        this.tasktypeList = [];
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
      addTypeBox(name) {
        let _this = this
        _this.$refs[name].validate((valid) => {
          if (valid) {
            _this.menuList.push({
              name: _this.typeValidate.addType,
              num: 0,
              icon: "icon-wenjian",
              type: "taskbox",
              checked: false
            });
            _this.syncTasktypeList();
            _this.$refs.addType_modal.close();
            _this.typeValidate.addType = "";
            _this.$refs[name].resetFields();
          }
        })
      },
      //关闭弹层回调，重置弹层内容成初始值
      addTypeClose(name) {
        let _this = this;
        _this.typeValidate.addType = "";
        _this.$refs[name].resetFields();
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
      addTask(name) {
        let _this = this
        _this.$refs[name].validate((valid) => {
          if (valid) {
            let title = _this.listValidate.taskName,
              date = _this.listValidate.addDate,
              times = _this.listValidate.thisTimes,
              category = _this.listValidate.thisTasktype,
              isShow = false,
              taskType = _this.checkedTaskType,
              id = guid()

            if (taskType == '全部' || taskType == category) {
              isShow = true
            }
            _this.todolist.unshift({
              id: id,
              title: title,
              category: category,
              remindDate: _this.$moment(date).format('YYYY-MM-DD HH:mm'),
              times: times,
              status: 0,
              checked: false,
              isShow: isShow,
              isRecover: false,
              editVisible: false
            })

            _this.updateNum();

            _this.listValidate.taskName = "";
            _this.listValidate.addDate = "";
            _this.listValidate.thisTimes = ""
            _this.listValidate.thisTasktype = ""
            _this.$refs.addTask_modal.close();
            //开启定时任务
            ipcRenderer.send('timedTask-message', {
              id: id,
              title: title,
              date: _this.$moment(date).format('YYYY-MM-DD HH:mm')
            })
          }
        });
        _this.$refs[name].resetFields();
      },
      //关闭弹层回调，重置弹层内容成初始值
      addTaskClose(name) {
        let _this = this;
        _this.listValidate.taskName = "";
        _this.listValidate.addDate = "";
        _this.listValidate.thisTimes = ""
        _this.listValidate.thisTasktype = "";
        _this.$refs[name].resetFields();
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
      editTask(index, name, item) {
        let _this = this;
        _this.$refs[name][0].validate((valid) => {
          if (valid) {
            _this.$refs['editTask_modal' + index][0].visible = false;
            _this.updateNum();
            //重置定时任务时间
            ipcRenderer.send('timedTask-message', {
              id: item.id,
              title: item.title,
              date: _this.$moment(item.remindDate).format('YYYY-MM-DD HH:mm')
            })

          }
        });
      },
      //关闭弹层回调，重置弹层内容成初始值
      editTaskClose() {
        let item = thisEditTask;
        let _this = this;
        let todo = _this.todolist[item.index]
        if(todo){
          _this.$set(todo, 'title', item.title);
          _this.$set(todo, 'category', item.category)
          _this.$set(todo, 'remindDate', item.remindDate)
          _this.$set(todo, 'times', item.times)
        }
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
          obj.isShow = false;
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
      },
      //接受定时任务完成信息
      getTaskResult() {
        let _this = this;
        ipcRenderer.on('timedTask-reply', (event, arg) => {  
          let task = JSON.parse(arg);
          _this.TASKID = task.id
          _this.$Notice.open({
            title: `事项名称：${task.title}`,
            duration:0,
            name:task.id,
            render(h){
              return(
                <div class="noticebox">
                  <span class="button over" onclick="VIEWMAIN.closeNotice(VIEWMAIN.TASKID)">已完成</span>
                   <i-select v-model={VIEWMAIN.selectTime} class="button" placeholder="推迟">
                     {
                        VIEWMAIN.postTimeList.map(item => {
                            return <i-option data-item={JSON.stringify(task)} data-ov={item.value} value={item.value} key={item.value} onclick="VIEWMAIN.postTimeHanldle($(this).attr('data-item'),$(this).attr('data-ov'))">{item.label}</i-option>
                        })
                   }
                   </i-select>
                </div>
              )
            }
          });
        })
      },
      //关闭通知
      closeNotice(id){
        let _this = this
        _this.$Notice.close(id);
        for(let item of _this.todolist){
          if(item.id == id){
            item.status = 1;
            item.checked = true;
          }
        }
        _this.updateNum();
    
      },
      postTimeHanldle(obj,time){
          let _this = this;
          let item = JSON.parse(obj);
          let date = _this.$moment(new Date()).valueOf();
          let postTime = _this.$moment(date + Number(time)).format('YYYY-MM-DD HH:mm')
          for(let i of _this.todolist){
            if(i.id == item.id){
              i.remindDate = postTime
            }
          }
          ipcRenderer.send('timedTask-message', {
              id: item.id,
              title: item.title,
              date: postTime
          })
           _this.$Notice.close(item.id);
      }
    },
    watch: {
      menuList: {
        handler: function (val, oldVal) {
          local.setData('menuList', val);
        },
        deep: true
      },
      todolist: {
        handler: function (val, oldVal) {
          local.setData('todolist', val);
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
      let _this = this
      _this.showList(_this.menuList[0])
      _this.updateNum();
      _this.syncTasktypeList();
      _this.getTaskResult();
      global.VIEWMAIN = _this;

      ipcRenderer.on('closeMainWin', function (e, arg) {  
        if (arg) {
            //重置所有弹层的状态 start
            _this.$store.commit('setIsOpen', false);
            _this.addTypeClose('typeValidate')
            _this.$refs.addType_modal.close();
            _this.editTaskClose();
            for(let m in _this.$refs){
              if(m.includes('editTask_modal')){
                  _this.$refs[m][0].visible = false;
              }
            }
            _this.addTaskClose('listValidate')
            _this.$refs.addTask_modal.close();
            //重置所有弹层的状态 end
            _this.$router.push({
                path:'floatbox'
            })
        }
      })  
    }
  }
</script>

