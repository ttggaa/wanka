package com.wk.cms.controller;

import com.wk.bean.BaseResponse;
import com.wk.cms.service.BankService;
import com.wk.entity.Bank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 银行信息控制类
 */
@RestController
@RequestMapping("/bank")
public class BankController extends  BaseController{
    @Autowired
    private BankService bankService;


    @RequestMapping(value = "/add",method = RequestMethod.POST)
    @ResponseBody
    @CrossOrigin
    public BaseResponse  add(@RequestBody Bank bank){
        String id = bankService.add(bank);
        return responseAdd(bank,id,this.getClass());
    }

    /**
     * 加载所有银行信息
     * @return
     */
    @RequestMapping(value = "/load")
    @ResponseBody
    @CrossOrigin
    public BaseResponse load(){
        List<Bank> banks = bankService.load();
        return responseSearch(banks,0,null, this.getClass());
    }
}
